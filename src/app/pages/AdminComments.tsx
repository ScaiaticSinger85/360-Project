import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function AdminComments() {
  const { user } = useAuth();
  const { allComments } = useData();

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background">Access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">All User Comments</h1>
            <p className="text-muted-foreground mt-2">Admin view of every comment stored in Mongo.</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {allComments.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No comments found.</CardContent></Card>
          ) : (
            allComments.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <span>{item.eventTitle}</span>
                    <span className="text-sm font-normal text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">By {item.userName || 'Unknown user'}</p>
                  <p>{item.comment}</p>
                  <Link to={`/events/${item.eventId}`}>
                    <Button variant="outline">Open Event</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
