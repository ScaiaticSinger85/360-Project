import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { getCategoryImage } from '../utils/categoryImages';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { format } from 'date-fns';

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
  rsvpUserIds: string[];
};

export default function MyRSVPs() {
  const { user } = useAuth();
  const { events = [], isLoading } = useData();

  const safeEvents: EventType[] = Array.isArray(events) ? events : [];

  const rsvpEvents = safeEvents.filter((event) => {
    const rsvpUserIds = Array.isArray(event.rsvpUserIds) ? event.rsvpUserIds : [];
    return user ? rsvpUserIds.includes(user.id) : false;
  });

  const upcomingEvents = rsvpEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = rsvpEvents
    .filter((event) => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allEvents = [...upcomingEvents, ...pastEvents];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-white">
          <h1 className="text-4xl font-bold mb-2">My RSVPs</h1>
          <p className="text-lg text-rose-100">
            Events you've saved or RSVP'd to
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="h-full">
                <Skeleton className="aspect-video w-full rounded-t-lg rounded-b-none" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-9 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
        <>
        <div className="mb-6">
          <p className="text-gray-600">
            {allEvents.length === 0 ? (
              <span className="text-red-600 font-semibold">No RSVP events yet</span>
            ) : (
              <span>
                You have <span className="font-semibold">{allEvents.length}</span>{' '}
                RSVP{allEvents.length === 1 ? '' : 's'}
              </span>
            )}
          </p>
        </div>

        {allEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={event.imageUrl || getCategoryImage(event.category)}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.onerror = null;
                        img.src = getCategoryImage(event.category);
                      }}
                    />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-600">
                        {event.category}
                      </span>
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </div>

                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {event.attendees} / {event.capacity} attending
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-14 w-14 text-rose-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🎉</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No RSVPs yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Discover events in Kelowna and RSVP to save your spot. They'll all appear here.
            </p>
            <Link to="/events">
              <Button size="lg" className="gap-2">Browse Events</Button>
            </Link>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
