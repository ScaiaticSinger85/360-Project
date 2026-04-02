import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Calendar, TrendingUp, Star } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { events, rsvps, reviews } = useData();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Access denied. Admin only.</p>
            <Link to="/">
              <Button className="w-full">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const usersData = localStorage.getItem('users');
  const totalUsers = usersData ? JSON.parse(usersData).length : 0;
  const totalEvents = events.length;
  const totalRSVPs = rsvps.length;
  const totalReviews = reviews.length;
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
  const pastEvents = events.filter(e => new Date(e.date) < new Date()).length;

  const categoryStats = [
    { name: 'Music', count: events.filter(e => e.category === 'Music').length },
    { name: 'Food & Drink', count: events.filter(e => e.category === 'Food & Drink').length },
    { name: 'Sports & Fitness', count: events.filter(e => e.category === 'Sports & Fitness').length },
    { name: 'Arts & Culture', count: events.filter(e => e.category === 'Arts & Culture').length },
    { name: 'Technology', count: events.filter(e => e.category === 'Technology').length },
    { name: 'Community', count: events.filter(e => e.category === 'Community').length },
  ].sort((a, b) => b.count - a.count);

  const recentEvents = events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Platform overview and management</p>
          </div>
          <Link to="/admin/users">
            <Button>Manage Users</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-3xl font-bold">{totalEvents}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {upcomingEvents} upcoming, {pastEvents} past
                  </p>
                </div>
                <Calendar className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total RSVPs</p>
                  <p className="text-3xl font-bold">{totalRSVPs}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalAttendees} total attendees
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold">{totalReviews}</p>
                </div>
                <Star className="h-12 w-12 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-sm text-gray-600">{cat.count} events</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${totalEvents > 0 ? (cat.count / totalEvents) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Created Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold line-clamp-1">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.organizerName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {event.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
