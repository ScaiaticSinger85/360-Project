import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  CalendarPlus,
  Heart,
  Settings,
  Users,
  Menu,
  Home,
} from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  const navLinks = (
    <>
      <Link to="/" onClick={closeMobile}>
        <Button variant={isActive('/') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>
      <Link to="/events" onClick={closeMobile}>
        <Button variant={isActive('/events') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
          <Calendar className="h-4 w-4" />
          Browse Events
        </Button>
      </Link>

      {user && user.role !== 'unregistered' && (
        <>
          <Link to="/create-event" onClick={closeMobile}>
            <Button variant={isActive('/create-event') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
              <CalendarPlus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          <Link to="/my-events" onClick={closeMobile}>
            <Button variant={isActive('/my-events') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
              <LayoutDashboard className="h-4 w-4" />
              My Events
            </Button>
          </Link>
          <Link to="/my-rsvps" onClick={closeMobile}>
            <Button variant={isActive('/my-rsvps') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
              <Heart className="h-4 w-4" />
              My RSVPs
            </Button>
          </Link>
        </>
      )}

      {user && user.role === 'admin' && (
        <>
          <Link to="/admin" onClick={closeMobile}>
            <Button variant={isActive('/admin') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <Link to="/admin/users" onClick={closeMobile}>
            <Button variant={isActive('/admin/users') ? 'default' : 'ghost'} className="gap-2 w-full justify-start">
              <Users className="h-4 w-4" />
              Users
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b-2 border-blue-600 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Kelowna Events</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/events">
                <Button variant={isActive('/events') ? 'default' : 'ghost'} className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Browse Events
                </Button>
              </Link>

              {user && user.role !== 'unregistered' && (
                <>
                  <Link to="/create-event">
                    <Button variant={isActive('/create-event') ? 'default' : 'ghost'} className="gap-2">
                      <CalendarPlus className="h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>
                  <Link to="/my-events">
                    <Button variant={isActive('/my-events') ? 'default' : 'ghost'} className="gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      My Events
                    </Button>
                  </Link>
                  <Link to="/my-rsvps">
                    <Button variant={isActive('/my-rsvps') ? 'default' : 'ghost'} className="gap-2">
                      <Heart className="h-4 w-4" />
                      My RSVPs
                    </Button>
                  </Link>
                </>
              )}

              {user && user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant={isActive('/admin') ? 'default' : 'ghost'} className="gap-2">
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right side: user actions + mobile menu */}
          <div className="flex items-center space-x-2">
            {!user ? (
              <>
                <Link to="/sign-in" className="hidden sm:block">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/sign-up" className="hidden sm:block">
                  <Button>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="hidden md:flex">
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="gap-2 text-red-600 hover:text-red-700 hidden md:flex"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 flex flex-col">
                  <div className="flex items-center gap-2 mb-6 pt-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-lg">Kelowna Events</span>
                  </div>

                  {user && (
                    <Link to="/profile" onClick={closeMobile} className="mb-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                            {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </Link>
                  )}

                  <div className="flex flex-col gap-1 flex-1">
                    {navLinks}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    {!user ? (
                      <div className="flex flex-col gap-2">
                        <Link to="/sign-in" onClick={closeMobile}>
                          <Button variant="outline" className="w-full">Sign In</Button>
                        </Link>
                        <Link to="/sign-up" onClick={closeMobile}>
                          <Button className="w-full">Sign Up</Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full gap-2 text-red-600 hover:text-red-700 justify-start"
                        onClick={() => { logout(); closeMobile(); }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
