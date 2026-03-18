import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  Calendar, 
  LayoutDashboard, 
  LogOut, 
  User, 
  CalendarPlus,
  Heart,
  Settings,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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

          <div className="flex items-center space-x-4">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-events" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      My Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-rsvps" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      My RSVPs
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users" className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          User Management
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
