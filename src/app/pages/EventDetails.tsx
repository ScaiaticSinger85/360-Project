import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  Trash,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Comment = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

type ReviewType = {
  id: string;
  eventId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function EventDetails() {
  const { id } = useParams();
  const eventId = id;

  const { user } = useAuth();
  const {
    events,
    toggleRSVP,
    getRSVP,
    getEventReviews,
    addEventReview,
    deleteEvent,
  } = useData();

  const navigate = useNavigate();

  const event = (events || []).find((e) => e.id === eventId);

  const [isRsvped, setIsRsvped] = useState(false);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    if (eventId) {
      setReviews(getEventReviews(eventId));
      fetchComments(eventId);
    }

    if (eventId && user) {
      setIsRsvped(getRSVP(eventId));
    }
  }, [eventId, user, events]);

  const fetchComments = async (eid: string) => {
    try {
      const res = await fetch(`/api/events/${eid}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch {
      // server offline — silently ignore
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to comment'); return; }
    if (!newComment.trim()) { toast.error('Comment cannot be empty'); return; }

    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/events/${eventId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: user.name, text: newComment.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment('');
        toast.success('Comment posted');
      } else {
        toast.error(data.message || 'Failed to post comment');
      }
    } catch {
      toast.error('Server offline — cannot post comments right now');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/comments/${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success('Comment deleted');
      }
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRSVP = async () => {
    if (!user) {
      toast.error('Please sign in');
      navigate('/sign-in');
      return;
    }

    try {
      await toggleRSVP(event.id);
      setIsRsvped(!isRsvped);
      toast.success(isRsvped ? 'RSVP removed' : 'RSVP successful');
    } catch {
      toast.error('Failed to RSVP');
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to leave a review');
      navigate('/sign-in');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    addEventReview(event.id, {
      author: user.name,
      rating,
      comment: comment.trim(),
    });

    setReviews(getEventReviews(event.id));
    setComment('');
    setRating(5);
    toast.success('Review submitted');
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id);
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const isOrganizer = user?.id === event.organizerId;
  const spotsRemaining = event.capacity - event.attendees;
  const isFull = spotsRemaining <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 bg-gray-100">
          <img
            src={event.imageUrl || 'https://placehold.co/1200x675?text=Event+Image'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/1200x675?text=Event+Image';
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge className="mb-3">{event.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600">
                Organized by <span className="font-semibold">{event.organizer}</span>
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{review.author}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>

                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet. Be the first to review this event.
                  </p>
                )}

                {user && isRsvped && (
                  <>
                    <div className="my-6 border-t" />
                    <form onSubmit={handleReview} className="space-y-4" id="review-form">
                      <div>
                        <Label>Your Rating</Label>
                        <div className="flex gap-2 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRating(i + 1)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  i < rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <Button type="submit">Submit Review</Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Discussion ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <form onSubmit={handleAddComment} className="mb-6 space-y-3">
                    <Textarea
                      placeholder="Join the discussion..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button type="submit" disabled={isPostingComment}>
                      {isPostingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    <Link to="/sign-in" className="text-blue-600 font-medium">Sign in</Link> to join the discussion.
                  </p>
                )}

                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 border-b pb-4 last:border-b-0">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{c.userName}</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(c.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{c.text}</p>
                        </div>
                        {user && (user.id === c.userId || user.role === 'admin') && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-gray-400 hover:text-red-500 mt-1"
                            title="Delete comment"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    No comments yet. Start the discussion!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Capacity</p>
                    <p className="text-sm text-gray-600">
                      {event.attendees} / {event.capacity} attending
                    </p>
                    <p className="text-sm text-gray-500">
                      {isFull ? (
                        <span className="text-red-600">Event is full</span>
                      ) : (
                        <span>{spotsRemaining} spots remaining</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user && !isOrganizer && (
              <Card>
                <CardHeader>
                  <CardTitle>RSVP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isRsvped && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">
                        You have RSVP’d to this event
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleRSVP}
                    className="w-full"
                    variant={isRsvped ? 'outline' : 'default'}
                    disabled={isFull && !isRsvped}
                  >
                    {isRsvped ? 'Cancel RSVP' : 'RSVP'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center mb-4 text-gray-600">
                    Sign in to RSVP to this event
                  </p>
                  <Link to="/sign-in">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {isOrganizer && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/edit-event/${event.id}`}>
                    <Button className="w-full gap-2" variant="outline">
                      <Edit className="h-4 w-4" />
                      Edit Event
                    </Button>
                  </Link>

                  <Button className="w-full gap-2" variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Delete Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}