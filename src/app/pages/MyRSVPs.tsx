import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function MyRSVPs() {
  const { user } = useAuth();
  const { events, rsvps } = useData();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Please sign in to view your RSVPs</p>
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myRsvps = rsvps.filter((r) => r.userId === user.id);
  const attendingEvents = myRsvps
    .filter((r) => r.status === 'attending')
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter((e) => e && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime());

  const maybeEvents = myRsvps
    .filter((r) => r.status === 'maybe')
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter((e) => e && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime());

  const EventCard = ({ event }: { event: any }) => (
    <Link to={`/events/${event.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <div className="aspect-video overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <Badge className="mb-2">{event.category}</Badge>
          <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-600">
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
              <span>{event.attendees} attending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My RSVPs</h1>
          <p className="text-lg text-gray-600">
            Events you're attending or interested in
          </p>
        </div>

        <Tabs defaultValue="attending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="attending">
              Attending ({attendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="maybe">
              Maybe ({maybeEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attending">
            {attendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendingEvents.map((event) => (
                  <EventCard key={event!.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 mb-4">You're not attending any upcoming events</p>
                  <Link to="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="maybe">
            {maybeEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maybeEvents.map((event) => (
                  <EventCard key={event!.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 mb-4">No events marked as maybe</p>
                  <Link to="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
