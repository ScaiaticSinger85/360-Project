import { useEffect } from 'react';
import { User } from '../types';

// Initialize demo users in localStorage
export function useInitializeData() {
  useEffect(() => {
    const usersData = localStorage.getItem('users');
    
    if (!usersData) {
      const demoUsers: User[] = [
        {
          id: 'user_admin',
          email: 'admin@kelowna.ca',
          name: 'Admin User',
          role: 'admin',
          createdAt: '2025-01-01T00:00:00Z',
          bio: 'Platform administrator for Kelowna Events',
        },
        {
          id: 'user_1',
          email: 'user@example.com',
          name: 'John Smith',
          role: 'registered',
          createdAt: '2026-01-15T10:00:00Z',
          bio: 'Event enthusiast and community organizer',
        },
        {
          id: 'user_2',
          email: 'sarah@okanagan.com',
          name: 'Okanagan Wine Society',
          role: 'registered',
          createdAt: '2025-12-01T00:00:00Z',
        },
        {
          id: 'user_3',
          email: 'sarah.mitchell@example.com',
          name: 'Sarah Mitchell',
          role: 'registered',
          createdAt: '2026-01-20T00:00:00Z',
          bio: 'Yoga instructor and wellness advocate',
        },
        {
          id: 'user_4',
          email: 'tech@okanagan.ca',
          name: 'Okanagan Tech Alliance',
          role: 'registered',
          createdAt: '2025-11-15T00:00:00Z',
        },
        {
          id: 'user_5',
          email: 'marcus.j@example.com',
          name: 'Marcus Johnson',
          role: 'registered',
          createdAt: '2026-02-01T00:00:00Z',
        },
        {
          id: 'user_6',
          email: 'gallery@kelowna.ca',
          name: 'Kelowna Art Gallery',
          role: 'registered',
          createdAt: '2025-10-01T00:00:00Z',
        },
        {
          id: 'user_7',
          email: 'chef.giovanni@example.com',
          name: 'Chef Giovanni Rossi',
          role: 'registered',
          createdAt: '2026-01-10T00:00:00Z',
        },
        {
          id: 'user_8',
          email: 'hiking@kelowna.ca',
          name: 'Kelowna Hiking Club',
          role: 'registered',
          createdAt: '2025-09-01T00:00:00Z',
        },
        {
          id: 'user_9',
          email: 'emma.t@example.com',
          name: 'Emma Thompson',
          role: 'registered',
          createdAt: '2026-02-15T00:00:00Z',
        },
      ];

      localStorage.setItem('users', JSON.stringify(demoUsers));
      console.log('Demo users initialized');
    }
  }, []);
}
