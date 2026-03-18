import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, RSVP, Review } from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';

interface DataContextType {
  events: Event[];
  rsvps: RSVP[];
  reviews: Review[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'attendees'>) => Event;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  createRSVP: (eventId: string, userId: string, status: RSVP['status']) => void;
  updateRSVP: (eventId: string, userId: string, status: RSVP['status']) => void;
  getRSVP: (eventId: string, userId: string) => RSVP | undefined;
  createReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getEventReviews: (eventId: string) => Review[];
  searchEvents: (query: string, category?: string) => Event[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Initialize data from localStorage or use sample data
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    const storedRsvps = localStorage.getItem('rsvps');
    const storedReviews = localStorage.getItem('reviews');

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Initialize with sample data
      setEvents(SAMPLE_EVENTS);
      localStorage.setItem('events', JSON.stringify(SAMPLE_EVENTS));
    }

    if (storedRsvps) {
      setRsvps(JSON.parse(storedRsvps));
    }

    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  const createEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'attendees'>): Event => {
    const newEvent: Event = {
      ...eventData,
      id: `event_${Date.now()}`,
      createdAt: new Date().toISOString(),
      attendees: 0,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // Also delete associated RSVPs and reviews
    const updatedRsvps = rsvps.filter(rsvp => rsvp.eventId !== id);
    setRsvps(updatedRsvps);
    localStorage.setItem('rsvps', JSON.stringify(updatedRsvps));

    const updatedReviews = reviews.filter(review => review.eventId !== id);
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

    const updatedRsvps = [...rsvps, newRsvp];
    setRsvps(updatedRsvps);
    localStorage.setItem('rsvps', JSON.stringify(updatedRsvps));

    // Update event attendee count
    if (status === 'attending') {
      const event = events.find(e => e.id === eventId);
      if (event) {
        updateEvent(eventId, { attendees: event.attendees + 1 });
      }
    }
  };

  const updateRSVP = (eventId: string, userId: string, status: RSVP['status']) => {
    const existingRsvp = rsvps.find(r => r.eventId === eventId && r.userId === userId);
    
    if (existingRsvp) {
      const oldStatus = existingRsvp.status;
      const updatedRsvps = rsvps.map(rsvp =>
        rsvp.eventId === eventId && rsvp.userId === userId
          ? { ...rsvp, status }
          : rsvp
      );
      setRsvps(updatedRsvps);
      localStorage.setItem('rsvps', JSON.stringify(updatedRsvps));

      // Update attendee count
      const event = events.find(e => e.id === eventId);
      if (event) {
        let attendeeChange = 0;
        if (oldStatus !== 'attending' && status === 'attending') attendeeChange = 1;
        if (oldStatus === 'attending' && status !== 'attending') attendeeChange = -1;
        
        if (attendeeChange !== 0) {
          updateEvent(eventId, { attendees: event.attendees + attendeeChange });
        }
      }
    } else {
      createRSVP(eventId, userId, status);
    }
  };

  const getRSVP = (eventId: string, userId: string): RSVP | undefined => {
    return rsvps.find(r => r.eventId === eventId && r.userId === userId);
  };

  const createReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const getEventReviews = (eventId: string): Review[] => {
    return reviews.filter(r => r.eventId === eventId);
  };

  const searchEvents = (query: string, category?: string): Event[] => {
    let filtered = events;

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query (case-insensitive, partial match)
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
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
