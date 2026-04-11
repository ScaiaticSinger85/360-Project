import { Link } from 'react-router';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryImage } from '../utils/categoryImages';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, MapPin, Users, ArrowRight, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { events } = useData();
  const { user } = useAuth();

  // Get upcoming events (sorted by date)
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  const categories = [
    { name: 'Music', icon: '🎵', count: events.filter(e => e.category === 'Music').length, bg: 'from-purple-500 to-pink-500' },
    { name: 'Food & Drink', icon: '🍷', count: events.filter(e => e.category === 'Food & Drink').length, bg: 'from-orange-400 to-red-500' },
    { name: 'Sports & Fitness', icon: '⚽', count: events.filter(e => e.category === 'Sports & Fitness').length, bg: 'from-green-400 to-emerald-600' },
    { name: 'Arts & Culture', icon: '🎨', count: events.filter(e => e.category === 'Arts & Culture').length, bg: 'from-yellow-400 to-orange-500' },
    { name: 'Technology', icon: '💻', count: events.filter(e => e.category === 'Technology').length, bg: 'from-blue-500 to-cyan-500' },
    { name: 'Community', icon: '🤝', count: events.filter(e => e.category === 'Community').length, bg: 'from-rose-400 to-fuchsia-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-40">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1578945761766-a4bc916e0dc7?w=1600&q=80"
            alt="Kelowna"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(to right, #2563eb, #4338ca)';
            }}
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Discover Events in Kelowna
            </h1>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto drop-shadow">
              Join your local community in amazing experiences. Find events, connect with neighbors,
              and make memories in beautiful Kelowna.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/events">
                <Button size="lg" variant="secondary" className="gap-2">
                  Browse Events
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              {user && user.role !== 'unregistered' ? (
                <Link to="/create-event">
                  <Button size="lg" variant="outline" className="text-white border-white bg-white/10 hover:bg-white/20">
                    Create Event
                  </Button>
                </Link>
              ) : (
                <Link to="/sign-up">
                  <Button size="lg" variant="outline" className="text-white border-white bg-white/10 hover:bg-white/20">
                    Sign Up Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{events.length}</div>
              <div className="text-gray-600">Active Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {events.reduce((sum, e) => sum + e.attendees, 0)}
              </div>
              <div className="text-gray-600">Total Attendees</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{categories.length}</div>
              <div className="text-gray-600">Event Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/events?category=${encodeURIComponent(category.name)}`}
              >
                <div className={`bg-gradient-to-br ${category.bg} rounded-xl p-6 text-center text-white hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer h-36 flex flex-col items-center justify-center`}>
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-1 leading-tight">{category.name}</h3>
                  <p className="text-xs text-white/80">{category.count} events</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="outline" className="gap-2">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.imageUrl || getCategoryImage(event.category)}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCategoryImage(event.category);
                      }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                      <span className="font-semibold">{event.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join our community today and start creating or attending amazing events in Kelowna.
            </p>
            <Link to="/sign-up">
              <Button size="lg" variant="secondary" className="gap-2">
                Sign Up Now - It's Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Browse Events</h3>
              <p className="text-gray-600">
                Explore a wide variety of events happening in Kelowna. Filter by category, date, or search for specific interests.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. RSVP & Connect</h3>
              <p className="text-gray-600">
                Sign up for free and RSVP to events you're interested in. Connect with other community members.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Create Your Own</h3>
              <p className="text-gray-600">
                Have an idea? Create your own events and bring the community together around your passions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
