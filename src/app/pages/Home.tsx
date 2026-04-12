import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryImage } from '../utils/categoryImages';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
  { name: 'Music',            emoji: '🎵', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Food & Drink',     emoji: '🍕', gradient: 'from-orange-500 to-amber-600' },
  { name: 'Sports & Fitness', emoji: '⚽', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Arts & Culture',   emoji: '🎨', gradient: 'from-purple-500 to-violet-600' },
  { name: 'Technology',       emoji: '💻', gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Community',        emoji: '🤝', gradient: 'from-yellow-500 to-orange-500' },
];

const DESC_LIMIT = 100;

function EventCard({ event }: { event: any }) {
  const [expanded, setExpanded] = useState(false);
  const long = (event.description || '').length > DESC_LIMIT;
  const shown = long && !expanded ? event.description.slice(0, DESC_LIMIT) + '…' : event.description;

  return (
    <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/80 border border-white/40">
      <div className="aspect-video bg-muted relative">
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
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {event.category}
        </span>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold line-clamp-2 mb-2">{event.title}</h3>
        <div className="mb-3">
          <p className="text-sm text-gray-600">{shown}</p>
          {long && (
            <button
              onClick={(e) => { e.preventDefault(); setExpanded((v) => !v); }}
              className="text-blue-600 text-xs font-medium hover:underline mt-1 focus:outline-none"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
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
            <span>{event.attendees} / {event.capacity} attending</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${event.attendees >= event.capacity ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
            />
          </div>
          <div className="pt-1">
            <span className="font-medium text-gray-700">Organizer: </span>
            <span className="text-gray-600">{event.organizer}</span>
          </div>
        </div>
        <div className="mt-4">
          <Button className="w-full">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { events } = useData();
  const { user } = useAuth();

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative text-white py-20">
        <img
          src="https://images.unsplash.com/photo-1578945761766-a4bc916e0dc7?w=1600&q=80"
          alt="Kelowna"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/65" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-blue-200 uppercase tracking-[0.25em] text-sm">Kelowna Community Hub</p>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Discover, discuss, and manage local events in one place.
            </h1>
            <p className="text-lg text-slate-200 mb-8">
              Browse community events, RSVP in real time, comment on posts, and connect with people around Kelowna.
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
                  <Button size="lg" variant="outline" className="border-white bg-white text-black hover:bg-transparent hover:text-white">
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

      {/* Stats */}
      <section className="py-12 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/70 border border-white/40 shadow-md"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Events</p><p className="text-4xl font-bold">{events.length}</p></CardContent></Card>
          <Card className="backdrop-blur-sm bg-white/70 border border-white/40 shadow-md"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Attendees</p><p className="text-4xl font-bold">{events.reduce((sum, e) => sum + e.attendees, 0)}</p></CardContent></Card>
          <Card className="backdrop-blur-sm bg-white/70 border border-white/40 shadow-md"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Upcoming</p><p className="text-4xl font-bold">{events.filter((e) => new Date(e.date) >= new Date()).length}</p></CardContent></Card>
          <Card className="backdrop-blur-sm bg-white/70 border border-white/40 shadow-md"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Categories</p><p className="text-4xl font-bold">6</p></CardContent></Card>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/events?category=${encodeURIComponent(cat.name)}`}>
                <div className={`relative rounded-xl p-4 text-center bg-gradient-to-br ${cat.gradient} text-white overflow-hidden hover:scale-105 transition-transform duration-200 shadow-md`}>
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl" />
                  <div className="relative">
                    <div className="text-3xl mb-2">{cat.emoji}</div>
                    <p className="text-sm font-semibold drop-shadow">{cat.name}</p>
                    <p className="text-xs mt-1 opacity-80">
                      {events.filter((e) => e.category === cat.name).length} events
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <p className="text-muted-foreground mt-2">The next events happening around Kelowna</p>
            </div>
            <Link to="/events">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
