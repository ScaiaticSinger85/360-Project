import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SAMPLE_EVENTS } from '../data/sampleEvents';

type EventType = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  imageUrl: string;
  organizer: string;
  organizerId: string;
  isPublic: boolean;
  attendees: number;
};

type CreateEventData = {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  imageUrl: string;
  organizer: string;
  organizerId: string;
  isPublic: boolean;
};

type UpdateEventData = {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  imageUrl: string;
  isPublic: boolean;
  attendees?: number;
};

type ReviewType = {
  id: string;
  eventId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type RSVPMap = Record<string, boolean>;

type DataContextType = {
  events: EventType[];
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  getEventsByOrganizerId: (organizerId: string) => Promise<EventType[]>;
  createEvent: (eventData: CreateEventData) => Promise<EventType>;
  updateEvent: (eventId: string, eventData: UpdateEventData) => Promise<EventType>;
  deleteEvent: (eventId: string) => Promise<void>;
  getRSVP: (eventId: string) => boolean;
  toggleRSVP: (eventId: string) => void;
  getEventReviews: (eventId: string) => ReviewType[];
  addEventReview: (eventId: string, review: Omit<ReviewType, 'id' | 'eventId' | 'createdAt'>) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:4000';
const RSVP_STORAGE_KEY = 'event_rsvps';
const REVIEWS_STORAGE_KEY = 'event_reviews';

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rsvps, setRsvps] = useState<RSVPMap>({});
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch events');
      }

      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents(SAMPLE_EVENTS as unknown as EventType[]);
    }
  };

  const getEventsByOrganizerId = async (organizerId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/events/user/${encodeURIComponent(organizerId)}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch user events');
    }

    return data.events || [];
  };

  const createEvent = async (eventData: CreateEventData) => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create event');
    }

    const newEvent = data.event;
    setEvents((prev) => [...prev, newEvent]);

    return newEvent;
  };

  const updateEvent = async (eventId: string, eventData: UpdateEventData) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to update event');
    }

    const updatedEvent = data.event;

    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? updatedEvent : event))
    );

    return updatedEvent;
  };

  const deleteEvent = async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete event');
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const getRSVP = (eventId: string) => {
    return !!rsvps[eventId];
  };

  const toggleRSVP = (eventId: string) => {
    setRsvps((prev) => {
      const updated = {
        ...prev,
        [eventId]: !prev[eventId],
      };

      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getEventReviews = (eventId: string) => {
    return reviews.filter((review) => review.eventId === eventId);
  };

  const addEventReview = (
    eventId: string,
    review: Omit<ReviewType, 'id' | 'eventId' | 'createdAt'>
  ) => {
    const newReview: ReviewType = {
      id: crypto.randomUUID(),
      eventId,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => {
      const updated = [...prev, newReview];
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      await fetchEvents();
      setIsLoading(false);
    };

    loadEvents();

    const savedRsvps = localStorage.getItem(RSVP_STORAGE_KEY);
    if (savedRsvps) {
      try {
        setRsvps(JSON.parse(savedRsvps));
      } catch {
        localStorage.removeItem(RSVP_STORAGE_KEY);
      }
    }

    const savedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {
        localStorage.removeItem(REVIEWS_STORAGE_KEY);
      }
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        events,
        isLoading,
        fetchEvents,
        getEventsByOrganizerId,
        createEvent,
        updateEvent,
        deleteEvent,
        getRSVP,
        toggleRSVP,
        getEventReviews,
        addEventReview,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  return context;
}