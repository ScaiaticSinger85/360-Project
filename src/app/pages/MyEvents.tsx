import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryImage } from '../utils/categoryImages';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type EventType = {
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
  organizerId: string;
  isPublic: boolean;
  attendees: number;
};

export default function MyEvents() {
  const { user } = useAuth();
  const { events, deleteEvent, fetchEvents, isLoading } = useData();
  const [myEvents, setMyEvents] = useState<EventType[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setMyEvents([]);
      return;
    }

    setMyEvents(events.filter((event) => event.organizerId === user.id));
  }, [events, user?.id]);

  useEffect(() => {
    if (!user?.id || events.length > 0) {
      return;
    }

    void fetchEvents().catch(() => {
      toast.error('Failed to load your events');
    });
  }, [user?.id, events.length]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await deleteEvent(id);
      setMyEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Please sign in to view your events</p>
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && myEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your events...</p>
      </div>
    );
  }

  const upcomingEvents = myEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = myEvents
    .filter((e) => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const EventCard = ({ event }: { event: EventType }) => (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img
          src={event.imageUrl || getCategoryImage(event.category)}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.src = getCategoryImage(event.category);
          }}
        />
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge>{event.category}</Badge>
          {event.attendees >= event.capacity && (
            <Badge variant="destructive">Full</Badge>
          )}
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {event.attendees} / {event.capacity} attending
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View
            </Button>
          </Link>

          <Link to={`/edit-event/${event.id}`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>

          <Button
            variant="outline"
            className="gap-2 text-red-600 hover:text-red-700"
            onClick={() => handleDelete(event.id, event.title)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Events</h1>
            <p className="text-lg text-indigo-100">Manage your created events</p>
          </div>
          <Link to="/create-event">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">Create New Event</Button>
          </Link>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 mb-4">
                    You haven't created any upcoming events yet
                  </p>
                  <Link to="/create-event">
                    <Button>Create Your First Event</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">No past events</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
