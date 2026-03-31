import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, RSVP, Review } from '../types';

const API_BASE_URL = 'http://localhost:4000';

interface DataContextType {
  events: Event[];
  rsvps: RSVP[];
  reviews: Review[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'attendees'>) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  createRSVP: (eventId: string, userId: string, status: RSVP['status']) => void;
  updateRSVP: (eventId: string, userId: string, status: RSVP['status']) => void;
  getRSVP: (eventId: string, userId: string) => RSVP | undefined;
  createReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getEventReviews: (eventId: string) => Review[];
  searchEvents: (query: string, category?: string) => Promise<Event[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch all events from the server on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`)
      .then(res => res.json())
      .then((data: Event[]) => setEvents(data))
      .catch(() => console.error('Failed to fetch events'));

    const storedRsvps = localStorage.getItem('rsvps');
    const storedReviews = localStorage.getItem('reviews');
    if (storedRsvps) setRsvps(JSON.parse(storedRsvps));
    if (storedReviews) setReviews(JSON.parse(storedReviews));
  }, []);

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'attendees'>): Promise<Event> => {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    const newEvent: Event = await res.json();
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = async (id: string, updates: Partial<Event>): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated: Event = await res.json();
    setEvents(prev => prev.map(e => (e.id === id ? updated : e)));
  };

  const deleteEvent = async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));

    const updatedRsvps = rsvps.filter(r => r.eventId !== id);
    setRsvps(updatedRsvps);
    localStorage.setItem('rsvps', JSON.stringify(updatedRsvps));

    const updatedReviews = reviews.filter(r => r.eventId !== id);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const createRSVP = (eventId: string, userId: string, status: RSVP['status']) => {
    const newRsvp: RSVP = {
      id: `rsvp_${Date.now()}`,
      eventId,
      userId,
      status,
      createdAt: new Date().toISOString(),
    };
    const updated = [...rsvps, newRsvp];
    setRsvps(updated);
    localStorage.setItem('rsvps', JSON.stringify(updated));

    if (status === 'attending') {
      const event = events.find(e => e.id === eventId);
      if (event) updateEvent(eventId, { attendees: event.attendees + 1 });
    }
  };

  const updateRSVP = (eventId: string, userId: string, status: RSVP['status']) => {
    const existing = rsvps.find(r => r.eventId === eventId && r.userId === userId);
    if (existing) {
      const oldStatus = existing.status;
      const updated = rsvps.map(r =>
        r.eventId === eventId && r.userId === userId ? { ...r, status } : r
      );
      setRsvps(updated);
      localStorage.setItem('rsvps', JSON.stringify(updated));

      const event = events.find(e => e.id === eventId);
      if (event) {
        let delta = 0;
        if (oldStatus !== 'attending' && status === 'attending') delta = 1;
        if (oldStatus === 'attending' && status !== 'attending') delta = -1;
        if (delta !== 0) updateEvent(eventId, { attendees: event.attendees + delta });
      }
    } else {
      createRSVP(eventId, userId, status);
    }
  };

  const getRSVP = (eventId: string, userId: string): RSVP | undefined =>
    rsvps.find(r => r.eventId === eventId && r.userId === userId);

  const createReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
  };

  const getEventReviews = (eventId: string): Review[] =>
    reviews.filter(r => r.eventId === eventId);

  const searchEvents = async (query: string, category?: string): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);

    const res = await fetch(`${API_BASE_URL}/api/events/search?${params.toString()}`);
    return res.json();
  };

  return (
    <DataContext.Provider
      value={{
        events,
        rsvps,
        reviews,
        createEvent,
        updateEvent,
        deleteEvent,
        createRSVP,
        updateRSVP,
        getRSVP,
        createReview,
        getEventReviews,
        searchEvents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
