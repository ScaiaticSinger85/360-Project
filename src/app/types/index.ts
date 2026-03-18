export type UserRole = 'unregistered' | 'registered' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Event {
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
  organizerId: string;
  organizerName: string;
  createdAt: string;
  attendees: number;
  isPublic: boolean;
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'attending' | 'maybe' | 'not-attending';
  createdAt: string;
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventFormData {
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
}
