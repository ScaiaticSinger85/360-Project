import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const { user } = useAuth();
  const { users, events, updateUserRole, updateUserStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const enrichedUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((entry) => {
      if (!query) return true;

      const ownsMatchingPost = events.some(
        (event) =>
          event.organizerId === entry.id &&
          `${event.title} ${event.description}`.toLowerCase().includes(query)
      );

      return (
        entry.name.toLowerCase().includes(query) ||
        entry.email.toLowerCase().includes(query) ||
        ownsMatchingPost
      );
    });
  }, [users, events, searchQuery]);

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background">Access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-2">Search by name, email, or post content and moderate accounts asynchronously.</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by name, email, or post title/description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Showing {enrichedUsers.length} users</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {enrichedUsers.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No users matched your admin search.</CardContent></Card>
          ) : (
            enrichedUsers.map((entry) => {
              const userEvents = events.filter((event) => event.organizerId === entry.id);

              return (
                <Card key={entry.id}>
                  <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <span>{entry.name}</span>
                      <span className="text-sm font-normal text-muted-foreground">{entry.email}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="capitalize">Role: {entry.role}</span>
                      <span>Status: {entry.isActive ? 'Active' : 'Disabled'}</span>
                      <span>Posts: {userEvents.length}</span>
                      <span>Comments: {entry.commentCount ?? 0}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        className="rounded-md border bg-background px-3 py-2"
                        value={entry.role}
                        onChange={async (e) => {
                          try {
                            await updateUserRole(entry.id, e.target.value);
                            toast.success('User role updated.');
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : 'Failed to update role.');
                          }
                        }}
                      >
                        <option value="admin">Admin</option>
                        <option value="registered">Registered</option>
                        <option value="unregistered">Unregistered</option>
                      </select>

                      <Button
                        variant={entry.isActive ? 'destructive' : 'default'}
                        onClick={async () => {
                          try {
                            await updateUserStatus(entry.id, !entry.isActive);
                            toast.success(entry.isActive ? 'User disabled.' : 'User enabled.');
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : 'Failed to update user status.');
                          }
                        }}
                      >
                        {entry.isActive ? 'Disable User' : 'Enable User'}
                      </Button>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="font-medium mb-3">Posts created by this user</p>
                      {userEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No posts created yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {userEvents.map((event) => (
                            <div key={event.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-lg border p-3">
                              <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Link to={`/edit-event/${event.id}`}>
                                  <Button variant="outline">Edit</Button>
                                </Link>
                                <Link to={`/events/${event.id}`}>
                                  <Button variant="outline">View</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
