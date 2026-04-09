import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
};

type SignupResult = {
  success: boolean;
  error?: string;
};

type LoginResult = {
  success: boolean;
  error?: string;
};

type UpdateProfileData = {
  name: string;
  bio: string;
  avatarFile?: File | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    avatarFile?: File | null
  ) => Promise<SignupResult>;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:4000';
const CURRENT_USER_KEY = 'currentUser';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
    avatarFile?: File | null
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('passwordConfirm', passwordConfirm);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.message || 'Failed to create account',
        };
      }

      setUser(data.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Server error. Please try again.',
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.message || 'Failed to sign in',
        };
      }

      setUser(data.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Server error. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!user) {
        return { success: false, error: 'You must be signed in' };
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio);

      if (data.avatarFile) {
        formData.append('avatar', data.avatarFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.message || 'Failed to update profile',
        };
      }

      setUser(result.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Server error. Please try again.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}