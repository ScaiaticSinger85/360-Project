import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getApiUrl, getAuthHeaders, parseApiResponse } from '../utils/api';

export type CommentType = {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
};

export type EventType = {
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
  organizerName: string;
  organizerId: string;
  isPublic: boolean;
  attendees: number;
  rsvpUserIds: string[];
  comments: CommentType[];
  commentCount: number;
  likeUserIds: string[];
  dislikeUserIds: string[];
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
  postCount?: number;
  commentCount?: number;
  reactionCount?: number;
};

type UsageReport = {
  filters: {
    startDate: string;
    endDate: string;
    role: string;
  };
  totals: {
    signups: number;
    posts: number;
    comments: number;
    likes: number;
    dislikes: number;
    disabledUsers: number;
  };
  signupsByDate: Array<{
    date: string;
    count: number;
  }>;
  hotThreads: Array<{
    id: string;
    title: string;
    commentCount: number;
    likeCount: number;
    score: number;
  }>;
};

type CommentHistoryItem = {
  id: string;
  eventId: string;
  eventTitle: string;
  userId?: string;
  userName?: string;
  comment: string;
  createdAt: string;
};

type EventPayload = {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  imageUrl?: string;
  imageFile?: File | null;
  isPublic: boolean;
};

type DataContextType = {
  events: EventType[];
  users: UserType[];
  usageReport: UsageReport | null;
  myCommentHistory: CommentHistoryItem[];
  allComments: CommentHistoryItem[];
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  fetchEventById: (eventId: string) => Promise<EventType>;
  fetchUsers: () => Promise<void>;
  fetchUsageReport: (filters?: { startDate?: string; endDate?: string; role?: string }) => Promise<void>;
  fetchMyCommentHistory: () => Promise<void>;
  fetchAllComments: () => Promise<void>;
  getEventsByOrganizerId: (organizerId: string) => Promise<EventType[]>;
  createEvent: (eventData: EventPayload) => Promise<EventType>;
  updateEvent: (eventId: string, eventData: EventPayload) => Promise<EventType>;
  deleteEvent: (eventId: string) => Promise<void>;
  toggleRSVP: (eventId: string) => Promise<EventType>;
  addEventComment: (eventId: string, comment: string) => Promise<EventType>;
  setEventReaction: (eventId: string, reaction: 'like' | 'dislike' | 'clear') => Promise<EventType>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

function buildEventFormData(eventData: EventPayload) {
  const formData = new FormData();
  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('category', eventData.category);
  formData.append('date', eventData.date);
  formData.append('time', eventData.time);
  formData.append('location', eventData.location);
  formData.append('address', eventData.address);
  formData.append('capacity', String(eventData.capacity));
  formData.append('isPublic', String(eventData.isPublic));

  if (eventData.imageUrl) {
    formData.append('imageUrl', eventData.imageUrl);
  }

  if (eventData.imageFile) {
    formData.append('image', eventData.imageFile);
  }

  return formData;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [usageReport, setUsageReport] = useState<UsageReport | null>(null);
  const [myCommentHistory, setMyCommentHistory] = useState<CommentHistoryItem[]>([]);
  const [allComments, setAllComments] = useState<CommentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await fetch(getApiUrl('/api/events'));
      const data = await parseApiResponse<{ success: boolean; events: EventType[] }>(response);
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchEventById = async (eventId: string) => {
    const response = await fetch(getApiUrl(`/api/events/${eventId}`));
    const data = await parseApiResponse<{ success: boolean; event: EventType }>(response);
    setEvents((previous) => {
      const exists = previous.some((event) => event.id === eventId);
      return exists
        ? previous.map((event) => (event.id === eventId ? data.event : event))
        : [data.event, ...previous];
    });
    return data.event;
  };

  const fetchUsers = async () => {
    if (!user || user.role !== 'admin') {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/users'), {
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await parseApiResponse<{ success: boolean; users: UserType[] }>(response);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchUsageReport = async (filters?: { startDate?: string; endDate?: string; role?: string }) => {
    if (!user || user.role !== 'admin') {
      setUsageReport(null);
      return;
    }

    const params = new URLSearchParams();

    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    if (filters?.role) params.set('role', filters.role);

    try {
      const response = await fetch(getApiUrl(`/api/users/reports/usage?${params.toString()}`), {
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await parseApiResponse<{ success: boolean; report: UsageReport }>(response);
      setUsageReport(data.report);
    } catch (error) {
      console.error('Failed to fetch usage report:', error);
    }
  };

  const fetchMyCommentHistory = async () => {
    if (!user) {
      setMyCommentHistory([]);
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/users/me/comments'), {
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await parseApiResponse<{ success: boolean; comments: CommentHistoryItem[] }>(response);
      setMyCommentHistory(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comment history:', error);
    }
  };

  const fetchAllComments = async () => {
    if (!user || user.role !== 'admin') {
      setAllComments([]);
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/users/comments'), {
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await parseApiResponse<{ success: boolean; comments: CommentHistoryItem[] }>(response);
      setAllComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch all comments:', error);
    }
  };

  const getEventsByOrganizerId = async (organizerId: string) => {
    const response = await fetch(getApiUrl(`/api/events/user/${encodeURIComponent(organizerId)}`));
    const data = await parseApiResponse<{ success: boolean; events: EventType[] }>(response);
    return data.events || [];
  };

  const createEvent = async (eventData: EventPayload) => {
    const response = await fetch(getApiUrl('/api/events'), {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: buildEventFormData(eventData),
    });

    const data = await parseApiResponse<{ success: boolean; event: EventType }>(response);
    setEvents((previous) => [data.event, ...previous]);
    return data.event;
  };

  const updateEvent = async (eventId: string, eventData: EventPayload) => {
    const response = await fetch(getApiUrl(`/api/events/${eventId}`), {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
      },
      body: buildEventFormData(eventData),
    });

    const data = await parseApiResponse<{ success: boolean; event: EventType }>(response);
    setEvents((previous) => previous.map((event) => (event.id === eventId ? data.event : event)));
    return data.event;
  };

  const deleteEvent = async (eventId: string) => {
    const response = await fetch(getApiUrl(`/api/events/${eventId}`), {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });

    await parseApiResponse<{ success: boolean }>(response);
    setEvents((previous) => previous.filter((event) => event.id !== eventId));
  };

  const toggleRSVP = async (eventId: string) => {
    const response = await fetch(getApiUrl(`/api/events/${eventId}/rsvp`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({}),
    });

    const data = await parseApiResponse<{ success: boolean; event: EventType }>(response);
    setEvents((previous) => previous.map((event) => (event.id === eventId ? data.event : event)));
    return data.event;
  };

  const addEventComment = async (eventId: string, comment: string) => {
    const response = await fetch(getApiUrl(`/api/events/${eventId}/comments`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ comment }),
    });

    const data = await parseApiResponse<{ success: boolean; event: EventType }>(response);
    setEvents((previous) => previous.map((event) => (event.id === eventId ? data.event : event)));
    await fetchMyCommentHistory();
    return data.event;
  };

  const setEventReaction = async (eventId: string, reaction: 'like' | 'dislike' | 'clear') => {
    const response = await fetch(getApiUrl(`/api/events/${eventId}/reactions`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ reaction }),
    });

    const data = await parseApiResponse<{ success: boolean; event: EventType }>(response);
    setEvents((previous) => previous.map((event) => (event.id === eventId ? data.event : event)));
    return data.event;
  };

  const updateUserRole = async (userId: string, role: string) => {
    const response = await fetch(getApiUrl(`/api/users/${userId}/role`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ role }),
    });

    const data = await parseApiResponse<{ success: boolean; user: UserType }>(response);
    setUsers((previous) => previous.map((entry) => (entry.id === userId ? { ...entry, ...data.user } : entry)));
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    const response = await fetch(getApiUrl(`/api/users/${userId}/status`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ isActive }),
    });

    const data = await parseApiResponse<{ success: boolean; user: UserType }>(response);
    setUsers((previous) => previous.map((entry) => (entry.id === userId ? { ...entry, ...data.user } : entry)));
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchEvents();
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!user) {
      setUsers([]);
      setUsageReport(null);
      setMyCommentHistory([]);
      setAllComments([]);
      return;
    }

    void fetchMyCommentHistory();

    if (user.role === 'admin') {
      void fetchUsers();
      void fetchUsageReport({ role: 'all' });
      void fetchAllComments();
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchEvents();

      if (user?.role === 'admin') {
        void fetchUsers();
        void fetchAllComments();
      }

      if (user) {
        void fetchMyCommentHistory();
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [user?.id, user?.role]);

  return (
    <DataContext.Provider
      value={{
        events,
        users,
        usageReport,
        myCommentHistory,
        allComments,
        isLoading,
        fetchEvents,
        fetchEventById,
        fetchUsers,
        fetchUsageReport,
        fetchMyCommentHistory,
        fetchAllComments,
        getEventsByOrganizerId,
        createEvent,
        updateEvent,
        deleteEvent,
        toggleRSVP,
        addEventComment,
        setEventReaction,
        updateUserRole,
        updateUserStatus,
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
