import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { AdminSideCart } from './AdminSideCart';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  Calendar,
  CalendarPlus,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
  Users,
} from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const { myCommentHistory } = useData();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin';
  const closeMobile = () => setMobileOpen(false);

  const primaryNavLinks = (
    <>
      <Link to="/events" onClick={closeMobile}>
        <Button variant={isActive('/events') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
          <Calendar className="h-4 w-4" />
          Browse Events
        </Button>
      </Link>

      {user && user.role !== 'unregistered' && (
        <>
          <Link to="/create-event" onClick={closeMobile}>
            <Button variant={isActive('/create-event') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
              <CalendarPlus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          <Link to="/my-events" onClick={closeMobile}>
            <Button variant={isActive('/my-events') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              My Events
            </Button>
          </Link>
          <Link to="/my-rsvps" onClick={closeMobile}>
            <Button variant={isActive('/my-rsvps') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
              <Heart className="h-4 w-4" />
              My RSVPs
            </Button>
          </Link>
          <Link to="/my-comments" onClick={closeMobile}>
            <Button variant={isActive('/my-comments') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              My Comments
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex min-w-0 items-center gap-3 lg:gap-5">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Calendar className="h-7 w-7 text-blue-600" />
              <span className="font-bold text-lg lg:text-xl text-foreground leading-none">Kelowna Events</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden xl:flex min-w-0 items-center gap-1">
              <Link to="/events">
                <Button variant={isActive('/events') ? 'default' : 'ghost'} className="gap-2 px-3 lg:px-4 text-sm">
                  <Calendar className="h-4 w-4" />
                  Browse Events
                </Button>
              </Link>

              {user && user.role !== 'unregistered' && (
                <>
                  <Link to="/create-event">
                    <Button variant={isActive('/create-event') ? 'default' : 'ghost'} className="gap-2 px-3 lg:px-4 text-sm">
                      <CalendarPlus className="h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>
                  <Link to="/my-events">
                    <Button variant={isActive('/my-events') ? 'default' : 'ghost'} className="gap-2 px-3 lg:px-4 text-sm">
                      <LayoutDashboard className="h-4 w-4" />
                      My Events
                    </Button>
                  </Link>
                  <Link to="/my-rsvps">
                    <Button variant={isActive('/my-rsvps') ? 'default' : 'ghost'} className="gap-2 px-3 lg:px-4 text-sm">
                      <Heart className="h-4 w-4" />
                      My RSVPs
                    </Button>
                  </Link>

                  <Link to="/my-comments">
                    <Button variant={isActive('/my-comments') ? 'default' : 'ghost'} className="gap-2 px-3 lg:px-4 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      My Comments
                      {myCommentHistory.length > 0 && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {myCommentHistory.length}
                        </span>
                      )}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right side: user actions + mobile menu */}
          <div className="flex shrink-0 items-center space-x-1 lg:space-x-2 ml-4 lg:ml-6">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="gap-2">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

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
                <AdminSideCart />
                <Link to="/profile" className="hidden xl:block">
                  <Button variant="ghost" className="gap-2 px-2 lg:px-3">
                    <User className="h-4 w-4" />
                    <span className="max-w-28 truncate">{user.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="hidden xl:inline-flex gap-2 text-red-600 hover:text-red-700"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            )}

            <div className="xl:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open navigation menu">
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

                  {isAdmin && <AdminSideCart />}

                  <div className="flex flex-col gap-1 flex-1">
                    {primaryNavLinks}

                    {user && (
                      <>
                        <Link to="/profile" onClick={closeMobile}>
                          <Button variant={isActive('/profile') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                            <User className="h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                      </>
                    )}
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
