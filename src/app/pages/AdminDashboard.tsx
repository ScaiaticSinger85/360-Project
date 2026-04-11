import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import {
  Users, Calendar, TrendingUp, LayoutDashboard, Search,
  Trash2, Edit, Eye, ShieldAlert, ArrowUpRight, CalendarDays,
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { events, deleteEvent } = useData();
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityDate, setActivityDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => { if (d.success) setTotalUsers(d.users.length); })
      .catch(() => {});
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
            <p className="font-semibold text-lg">Access Denied</p>
            <p className="text-gray-500 text-sm">This page is for admins only.</p>
            <Link to="/"><Button className="w-full">Go Home</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;
  const pastEvents = events.filter((e) => new Date(e.date) < new Date()).length;
  const totalRsvps = events.reduce((sum, e) => sum + (e.rsvpUserIds?.length || 0), 0);

  // ── Category bar chart data ───────────────────────────────────────────────
  const categoryChartData = [
    'Music', 'Food & Drink', 'Sports & Fitness', 'Arts & Culture', 'Technology', 'Community',
  ].map((name) => ({
    name: name.length > 10 ? name.split(' ')[0] : name,
    fullName: name,
    count: events.filter((e) => e.category === name).length,
    attendees: events.filter((e) => e.category === name).reduce((s, e) => s + e.attendees, 0),
  }));

  // ── Monthly events line chart (last 6 months) ────────────────────────────
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const monthStart = startOfMonth(subMonths(new Date(), 5 - i));
    const monthEnd = endOfMonth(subMonths(new Date(), 5 - i));
    const count = events.filter((e) => {
      try {
        return isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd });
      } catch { return false; }
    }).length;
    return { month: format(monthStart, 'MMM'), events: count };
  });

  // ── Activity by date ──────────────────────────────────────────────────────
  const eventsOnDate = events.filter((e) => e.date === activityDate);

  // ── Filtered events table ─────────────────────────────────────────────────
  const filteredEvents = events
    .filter((e) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const statCards = [
    { label: 'Total Users', value: totalUsers, sub: 'registered accounts', icon: Users, bg: 'bg-blue-50', iconBg: 'bg-blue-600' },
    { label: 'Total Events', value: totalEvents, sub: `${upcomingEvents} upcoming · ${pastEvents} past`, icon: Calendar, bg: 'bg-green-50', iconBg: 'bg-green-600' },
    { label: 'Total Attendees', value: totalAttendees, sub: 'across all events', icon: TrendingUp, bg: 'bg-purple-50', iconBg: 'bg-purple-600' },
    { label: 'Total RSVPs', value: totalRsvps, sub: 'event sign-ups', icon: LayoutDashboard, bg: 'bg-orange-50', iconBg: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-10 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-300 mt-1">Platform overview and event management</p>
            </div>
          </div>
          <Link to="/admin/users">
            <Button variant="outline" className="gap-2 text-white border-white/30 bg-white/10 hover:bg-white/20">
              <Users className="h-4 w-4" />
              Manage Users
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s) => (
            <Card key={s.label} className={`${s.bg} border-0`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${s.iconBg} rounded-xl p-3`}>
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Bar chart — events & attendees by category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Events & Attendees by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value, name) => [value, name === 'count' ? 'Events' : 'Attendees']}
                    labelFormatter={(label) =>
                      categoryChartData.find((d) => d.name === label)?.fullName || label
                    }
                  />
                  <Legend formatter={(v) => (v === 'count' ? 'Events' : 'Attendees')} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendees" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line chart — events per month */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Events Per Month (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10b981' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity by Date */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Activity by Date</CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">See all events scheduled on a specific date</p>
                </div>
              </div>
              <Input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full sm:w-48"
              />
            </div>
          </CardHeader>
          <CardContent>
            {eventsOnDate.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No events on {format(new Date(activityDate + 'T00:00:00'), 'MMMM d, yyyy')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold text-gray-900">{eventsOnDate.length}</span>{' '}
                  {eventsOnDate.length === 1 ? 'event' : 'events'} on{' '}
                  {format(new Date(activityDate + 'T00:00:00'), 'MMMM d, yyyy')}
                </p>
                {eventsOnDate.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{e.title}</p>
                      <p className="text-sm text-gray-500">{e.time} · {e.location} · by {e.organizer}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <Badge variant="secondary">{e.category}</Badge>
                      <span className="text-sm text-gray-600">{e.attendees}/{e.capacity}</span>
                      <div className="flex gap-1">
                        <Link to={`/events/${e.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(e.id, e.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Popular Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Popular Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...events]
                .sort((a, b) => b.attendees - a.attendees)
                .slice(0, 5)
                .map((e, i) => (
                  <div key={e.id} className="flex items-center gap-4">
                    <span className={`text-lg font-bold w-6 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Link to={`/events/${e.id}`} className="font-medium text-sm hover:text-blue-600 truncate">{e.title}</Link>
                        <span className="text-xs text-gray-500 ml-2 shrink-0">{e.attendees}/{e.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (e.attendees / e.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* All Events Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg">All Events ({filteredEvents.length})</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, organizer, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Event</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Organizer</th>
                    <th className="pb-3 font-medium">Attendance</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEvents.map((event) => {
                    const isPast = new Date(event.date) < new Date();
                    const isFull = event.attendees >= event.capacity;
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <p className="font-medium line-clamp-1 max-w-[200px]">{event.title}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary">{event.category}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </td>
                        <td className="py-3 pr-4 text-gray-600 max-w-[120px] truncate">
                          {event.organizer}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={isFull ? 'text-red-600 font-medium' : 'text-gray-600'}>
                            {event.attendees}/{event.capacity}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={isPast ? 'secondary' : isFull ? 'destructive' : 'default'}>
                            {isPast ? 'Past' : isFull ? 'Full' : 'Active'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Link to={`/events/${event.id}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/edit-event/${event.id}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(event.id, event.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">No events found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
