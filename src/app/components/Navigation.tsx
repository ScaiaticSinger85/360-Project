import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import {
  Calendar,
  CalendarPlus,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Navigation() {
  const { user, logout } = useAuth();
  const { myCommentHistory } = useData();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-foreground">Kelowna Events</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
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

                  <Link to="/my-comments">
                    <Button variant={isActive('/my-comments') ? 'default' : 'ghost'} className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      My Comments
                      {myCommentHistory.length > 0 && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {myCommentHistory.length}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={isActive('/admin/comments') ? 'default' : 'ghost'} className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          All Comments
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem asChild>
                          <Link to="/admin/comments">All User Comments</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="gap-2">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

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
                {isAdmin && (
                  <>
                    <Link to="/admin">
                      <Button variant={isActive('/admin') ? 'default' : 'ghost'} className="gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Admin DB</span>
                      </Button>
                    </Link>
                    <Link to="/admin/users">
                      <Button variant={isActive('/admin/users') ? 'default' : 'ghost'} className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Users</span>
                      </Button>
                    </Link>
                  </>
                )}

                <Link to="/profile">
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </Link>

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
