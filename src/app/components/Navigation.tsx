import React from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  CalendarPlus,
  Heart,
  Settings,
  Users
} from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b-2 border-blue-600 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Kelowna Events</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/events">
                <Button
                  variant={isActive('/events') ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Browse Events
                </Button>
              </Link>

              {user && user.role !== 'unregistered' && (
                <>
                  <Link to="/create-event">
                    <Button
                      variant={isActive('/create-event') ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>

                  <Link to="/my-events">
                    <Button
                      variant={isActive('/my-events') ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Events
                    </Button>
                  </Link>

                  <Link to="/my-rsvps">
                    <Button
                      variant={isActive('/my-rsvps') ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      My RSVPs
                    </Button>
                  </Link>
                </>
              )}

              {user && user.role === 'admin' && (
                <Link to="/admin">
                  <Button
                    variant={isActive('/admin') ? 'default' : 'ghost'}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!user ? (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin">
                      <Button variant="ghost" className="gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Admin</span>
                      </Button>
                    </Link>
                    <Link to="/admin/users">
                      <Button variant="ghost" className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Users</span>
                      </Button>
                    </Link>
                  </>
                )}
                <Button variant="ghost" className="gap-2 text-red-600 hover:text-red-700" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
