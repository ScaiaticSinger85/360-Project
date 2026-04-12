import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Users, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { users, usageReport, fetchUsers, fetchUsageReport } = useData();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    role: 'all',
  });

  useEffect(() => {
    void fetchUsers();
    void fetchUsageReport(filters);
  }, []);

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background">Access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Monitor Mongo-backed users, activity, and thread usage.</p>
          </div>
          <Link to="/admin/users">
            <Button>Open User Management</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Mongo Users</p><p className="text-3xl font-bold">{users.length}</p></div><Users className="h-10 w-10 text-blue-600" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Posts</p><p className="text-3xl font-bold">{usageReport?.totals.posts ?? 0}</p></div><Calendar className="h-10 w-10 text-green-600" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Comments</p><p className="text-3xl font-bold">{usageReport?.totals.comments ?? 0}</p></div><MessageSquare className="h-10 w-10 text-orange-600" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Likes</p><p className="text-3xl font-bold">{usageReport?.totals.likes ?? 0}</p></div><ThumbsUp className="h-10 w-10 text-purple-600" /></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input type="date" value={filters.startDate} onChange={(e) => setFilters((previous) => ({ ...previous, startDate: e.target.value }))} />
            <Input type="date" value={filters.endDate} onChange={(e) => setFilters((previous) => ({ ...previous, endDate: e.target.value }))} />
            <select className="rounded-md border bg-background px-3 py-2" value={filters.role} onChange={(e) => setFilters((previous) => ({ ...previous, role: e.target.value }))}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="registered">Registered</option>
              <option value="unregistered">Unregistered</option>
            </select>
            <Button onClick={() => void fetchUsageReport(filters)}>Apply Filters</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Signups By Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {usageReport?.signupsByDate.length ? usageReport.signupsByDate.map((item) => (
                <div key={item.date} className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <span>{item.date}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              )) : <p className="text-muted-foreground">No signup activity in the selected range.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hot Threads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {usageReport?.hotThreads.length ? usageReport.hotThreads.map((thread) => (
                <div key={thread.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{thread.title}</p>
                    <span className="text-sm text-muted-foreground">Score {thread.score}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {thread.commentCount} comments, {thread.likeCount} likes
                  </p>
                </div>
              )) : <p className="text-muted-foreground">No thread data yet.</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mongo User Monitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map((entry) => (
              <div key={entry.id} className="rounded-lg border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">{entry.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="mr-4 capitalize">{entry.role}</span>
                    <span>{entry.isActive ? 'Active' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
