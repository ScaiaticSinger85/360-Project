import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Get users from localStorage
    const usersData = localStorage.getItem('users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    // Find user by email
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    // In a real app, we'd verify password hash
    // For demo, we'll just check if password is at least 6 characters
    if (password.length < 6) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Set current user
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Validate inputs
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    // Get existing users
    const usersData = localStorage.getItem('users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: 'registered',
      createdAt: new Date().toISOString(),
    };

    // Add to users array and save
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set as current user
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array
    const usersData = localStorage.getItem('users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
