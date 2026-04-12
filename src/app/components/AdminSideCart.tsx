import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Bell,
  Settings,
  Users,
  MessageSquare,
  LayoutDashboard,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Heart,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItem {
  id: string;
  type: 'comment' | 'reaction' | 'rsvp' | 'user_registration' | 'event_created';
  title: string;
  message: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  eventId?: string;
  eventTitle?: string;
  unread: boolean;
}

export function AdminSideCart() {
  const { user } = useAuth();
  const { events, users } = useData();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const isAdmin = user?.role === 'admin';

  // Generate real notifications from actual data
  useEffect(() => {
    if (!isAdmin) return;

    const realNotifications: NotificationItem[] = [];

    // Get recent comments (last 24 hours)
    events.forEach(event => {
      if (event.comments && Array.isArray(event.comments)) {
        event.comments.forEach(comment => {
          const commentDate = new Date(comment.createdAt);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

          if (commentDate > oneDayAgo) {
            realNotifications.push({
              id: `comment-${comment.id}`,
              type: 'comment',
              title: 'New Comment',
              message: `${comment.author} commented on "${event.title}"`,
              timestamp: commentDate,
              userId: comment.authorId,
              userName: comment.author,
              eventId: event.id,
              eventTitle: event.title,
              unread: true,
            });
          }
        });
      }
    });

    // Get recent reactions (last 24 hours)
    events.forEach(event => {
      if (event.reactions) {
        const reactionDate = new Date(event.reactions.lastUpdated || event.createdAt);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        if (reactionDate > oneDayAgo && (event.reactions.likes > 0 || event.reactions.dislikes > 0)) {
          realNotifications.push({
            id: `reaction-${event.id}`,
            type: 'reaction',
            title: 'New Reactions',
            message: `"${event.title}" received ${event.reactions.likes + event.reactions.dislikes} reactions`,
            timestamp: reactionDate,
            eventId: event.id,
            eventTitle: event.title,
            unread: true,
          });
        }
      }
    });

    // Get recent RSVPs (last 24 hours)
    events.forEach(event => {
      if (event.rsvpUsers && Array.isArray(event.rsvpUsers)) {
        event.rsvpUsers.forEach(rsvp => {
          const rsvpDate = new Date(rsvp.rsvpDate);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

          if (rsvpDate > oneDayAgo) {
            realNotifications.push({
              id: `rsvp-${rsvp.userId}-${event.id}`,
              type: 'rsvp',
              title: 'New RSVP',
              message: `${rsvp.userName} RSVP'd to "${event.title}"`,
              timestamp: rsvpDate,
              userId: rsvp.userId,
              userName: rsvp.userName,
              eventId: event.id,
              eventTitle: event.title,
              unread: true,
            });
          }
        });
      }
    });

    // Get recent user registrations (last 7 days)
    users.forEach(user => {
      const userDate = new Date(user.createdAt);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      if (userDate > sevenDaysAgo && user.role !== 'admin') {
        realNotifications.push({
          id: `user-${user.id}`,
          type: 'user_registration',
          title: 'New User Registration',
          message: `${user.name} joined the platform`,
          timestamp: userDate,
          userId: user.id,
          userName: user.name,
          unread: true,
        });
      }
    });

    // Get recent events created (last 7 days)
    events.forEach(event => {
      const eventDate = new Date(event.createdAt);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      if (eventDate > sevenDaysAgo) {
        realNotifications.push({
          id: `event-${event.id}`,
          type: 'event_created',
          title: 'New Event Created',
          message: `"${event.title}" was created by ${event.organizer}`,
          timestamp: eventDate,
          userId: event.organizerId,
          userName: event.organizer,
          eventId: event.id,
          eventTitle: event.title,
          unread: true,
        });
      }
    });

    // Sort by timestamp (newest first) and limit to 50
    realNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setNotifications(realNotifications.slice(0, 50));
  }, [events, users, isAdmin]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'reaction': return <Heart className="h-4 w-4 text-red-500" />;
      case 'rsvp': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'user_registration': return <UserCheck className="h-4 w-4 text-purple-500" />;
      case 'event_created': return <Calendar className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isAdmin) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden lg:inline">Admin</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="font-bold text-lg">Admin Panel</h2>
          </div>
          {unreadCount > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark Read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Admin Navigation */}
        <div className="space-y-2 mb-6">
          <Link to="/admin" onClick={() => setOpen(false)}>
            <Button
              variant={location.pathname === '/admin' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <Link to="/admin/users" onClick={() => setOpen(false)}>
            <Button
              variant={location.pathname === '/admin/users' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <Users className="h-4 w-4" />
              User Management
            </Button>
          </Link>
          <Link to="/admin/comments" onClick={() => setOpen(false)}>
            <Button
              variant={location.pathname === '/admin/comments' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              All Comments
            </Button>
          </Link>
        </div>

        <Separator className="mb-4" />

        {/* Notifications */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Activity
            </h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>

          <div className="space-y-3 overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.unread
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                      : 'bg-background border-border'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}