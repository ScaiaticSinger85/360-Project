import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function MyComments() {
  const { user } = useAuth();
  const { myCommentHistory } = useData();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 space-y-4">
            <p className="text-center">Please sign in to view your comment history.</p>
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">My Comment History</h1>
          <p className="text-muted-foreground mt-2">
            Review every event comment you have posted.
          </p>
        </div>

        <div className="space-y-4">
          {myCommentHistory.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                You have not posted any comments yet.
              </CardContent>
            </Card>
          ) : (
            myCommentHistory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.eventTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p>{item.comment}</p>
                  <Link to={`/events/${item.eventId}`}>
                    <Button variant="outline">View Event</Button>
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
