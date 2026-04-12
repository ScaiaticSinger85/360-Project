import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MapPin,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { sanitizePlainText } from '../utils/security';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { events, deleteEvent, toggleRSVP, addEventComment, setEventReaction, fetchEventById } = useData();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const event = useMemo(() => events.find((entry) => entry.id === id), [events, id]);

  useEffect(() => {
    if (!id) return;
    void fetchEventById(id).catch((error) => {
      console.error('Failed to fetch event details:', error);
    });
  }, [id]);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Event not found.</div>;
  }

  const comments = Array.isArray(event.comments) ? event.comments : [];
  const rsvpUserIds = Array.isArray(event.rsvpUserIds) ? event.rsvpUserIds : [];
  const likeUserIds = Array.isArray(event.likeUserIds) ? event.likeUserIds : [];
  const dislikeUserIds = Array.isArray(event.dislikeUserIds) ? event.dislikeUserIds : [];
  const commentCount = typeof event.commentCount === 'number' ? event.commentCount : comments.length;
  const likeCount = typeof event.likeCount === 'number' ? event.likeCount : likeUserIds.length;
  const dislikeCount =
    typeof event.dislikeCount === 'number' ? event.dislikeCount : dislikeUserIds.length;

  const isOrganizer = user?.id === event.organizerId || user?.role === 'admin';
  const hasRsvped = !!user && rsvpUserIds.includes(user.id);
  const currentReaction = user
    ? likeUserIds.includes(user.id)
      ? 'like'
      : dislikeUserIds.includes(user.id)
        ? 'dislike'
        : 'clear'
    : 'clear';
  const visibleComments = showAllComments ? comments : comments.slice(0, 3);

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id);
      toast.success('Event deleted successfully.');
      navigate('/events');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete event.');
    }
  };

  const handleComment = async (entry: React.FormEvent) => {
    entry.preventDefault();

    if (!user) {
      toast.error('Please sign in to comment.');
      navigate('/sign-in');
      return;
    }

    try {
      setIsSubmitting(true);
      await addEventComment(event.id, sanitizePlainText(comment));
      await fetchEventById(event.id);
      setComment('');
      toast.success('Comment added.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (reaction: 'like' | 'dislike') => {
    if (!user) {
      toast.error('Please sign in to react.');
      navigate('/sign-in');
      return;
    }

    try {
      const nextReaction = currentReaction === reaction ? 'clear' : reaction;
      await setEventReaction(event.id, nextReaction);
      await fetchEventById(event.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update reaction.');
    }
  };

  const handleRsvp = async () => {
    if (!user) {
      toast.error('Please sign in to RSVP.');
      navigate('/sign-in');
      return;
    }

    try {
      await toggleRSVP(event.id);
      await fetchEventById(event.id);
      toast.success(hasRsvped ? 'RSVP removed.' : 'RSVP added.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update RSVP.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-2xl border">
              <img src={event.imageUrl} alt={event.title} className="h-[420px] w-full object-cover" />
            </div>

            <div>
              <Badge className="mb-4">{event.category}</Badge>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground">Hosted by {event.organizerName}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Comments ({commentCount})</span>
                  {comments.length > 3 ? (
                    <Button variant="ghost" onClick={() => setShowAllComments((previous) => !previous)}>
                      {showAllComments ? 'Show Less' : 'Show More'}
                    </Button>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visibleComments.length === 0 ? (
                  <p className="text-muted-foreground">No comments yet. Start the discussion.</p>
                ) : (
                  visibleComments.map((item) => (
                    <div key={item.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold">{item.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="mt-2">{item.comment}</p>
                    </div>
                  ))
                )}

                <form onSubmit={handleComment} className="space-y-3 border-t pt-4">
                  <Textarea
                    rows={4}
                    placeholder="Leave a comment on this event..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-blue-600" />{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</div>
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-blue-600" />{event.time}</div>
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-blue-600" />{event.location}</div>
                <div className="flex items-center gap-3"><Users className="h-4 w-4 text-blue-600" />{event.attendees} / {event.capacity} attending</div>
                <div className="flex items-center gap-3"><MessageSquare className="h-4 w-4 text-blue-600" />{commentCount} comments</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <Button variant={currentReaction === 'like' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => handleReaction('like')}>
                    <ThumbsUp className="h-4 w-4" />
                    {likeCount}
                  </Button>
                  <Button variant={currentReaction === 'dislike' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => handleReaction('dislike')}>
                    <ThumbsDown className="h-4 w-4" />
                    {dislikeCount}
                  </Button>
                </div>
                <Button className="w-full" variant={hasRsvped ? 'outline' : 'default'} onClick={handleRsvp}>
                  {hasRsvped ? 'Cancel RSVP' : 'RSVP to Event'}
                </Button>
              </CardContent>
            </Card>

            {isOrganizer ? (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/edit-event/${event.id}`}>
                    <Button variant="outline" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Event
                    </Button>
                  </Link>
                  <Button variant="destructive" className="w-full gap-2" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Delete Event
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
