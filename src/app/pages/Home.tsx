import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryImage } from '../utils/categoryImages';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Calendar, MapPin, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { events } = useData();
  const { user } = useAuth();
  const totalComments = events.reduce(
    (sum, event) => sum + (Number.isFinite(event.commentCount) ? event.commentCount : 0),
    0
  );
  const totalReactions = events.reduce(
    (sum, event) =>
      sum +
      (Number.isFinite(event.likeCount) ? event.likeCount : 0) +
      (Number.isFinite(event.dislikeCount) ? event.dislikeCount : 0),
    0
  );

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-blue-700 via-slate-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-blue-200 uppercase tracking-[0.25em] text-sm">Kelowna Community Hub</p>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Discover, discuss, and manage local events in one place.
            </h1>
            <p className="text-lg text-slate-200 mb-8">
              Browse community events, RSVP in real time, comment on posts, and use the admin tools to monitor activity across the site.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events">
                <Button size="lg" className="gap-2">
                  Browse Events
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              {user ? (
                <Link to="/create-event">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white bg-white text-black hover:bg-transparent hover:text-white dark:border-slate-900 dark:bg-slate-900 dark:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    Create Event
                  </Button>
                </Link>
              ) : (
                <Link to="/sign-up">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign Up Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Events</p><p className="text-4xl font-bold">{events.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Attendees</p><p className="text-4xl font-bold">{events.reduce((sum, event) => sum + event.attendees, 0)}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Comments</p><p className="text-4xl font-bold">{totalComments}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Reactions</p><p className="text-4xl font-bold">{totalReactions}</p></CardContent></Card>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <p className="text-muted-foreground mt-2">Live updates, comments, likes, and RSVP counts appear without a refresh.</p>
            </div>
            <Link to="/events">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-muted">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">{event.category}</p>
                      <h3 className="text-xl font-bold line-clamp-2 mt-1">{event.title}</h3>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-foreground">
                        <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{event.attendees}</span>
                        <span className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" />{Number.isFinite(event.commentCount) ? event.commentCount : 0}</span>
                        <span className="inline-flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{Number.isFinite(event.likeCount) ? event.likeCount : 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
