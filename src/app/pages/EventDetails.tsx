import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCategoryImage } from '../utils/categoryImages';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
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
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Comment = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
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
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (eventId) {
      setReviews(getEventReviews(eventId));
      fetchComments(eventId);
    }

    if (eventId && user) {
      setIsRsvped(getRSVP(eventId, user.id));
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
        body: JSON.stringify({ userId: user.id, userName: user.name, avatarUrl: user.avatarUrl || '', text: newComment.trim() }),
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
      await toggleRSVP(event.id, user.id);
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
        <div className="flex items-center justify-between mb-6">
          <Link to="/events">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 bg-gray-100 relative">
          <img
            src={event.imageUrl || getCategoryImage(event.category)}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getCategoryImage(event.category);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">{event.category}</Badge>
            <h1 className="text-4xl font-bold mb-1 drop-shadow-lg">{event.title}</h1>
            <p className="text-white/80">Organized by <span className="font-semibold text-white">{event.organizer}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const LIMIT = 300;
                  const long = event.description.length > LIMIT;
                  const shown = long && !descExpanded ? event.description.slice(0, LIMIT) + '…' : event.description;
                  return (
                    <>
                      <p className="text-gray-700 whitespace-pre-wrap">{shown}</p>
                      {long && (
                        <button
                          onClick={() => setDescExpanded((v) => !v)}
                          className="mt-2 text-blue-600 text-sm font-medium hover:underline focus:outline-none"
                        >
                          {descExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </>
                  );
                })()}
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
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {review.author.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{review.author}</span>
                          </div>
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
                        <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                          <AvatarImage src={c.avatarUrl || (user?.id === c.userId ? user?.avatarUrl : undefined)} />
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {c.userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
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
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Event Details</h3>
              </div>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Date</p>
                    <p className="text-sm text-gray-600">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Time</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-rose-100 rounded-lg p-2 flex-shrink-0">
                    <MapPin className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Location</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Capacity</p>
                    <p className="text-sm text-gray-600 mb-1">{event.attendees} / {event.capacity} attending</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {isFull ? <span className="text-red-600 font-medium">Event is full</span> : <span>{spotsRemaining} spots remaining</span>}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user && !isOrganizer && (
              <Card className="overflow-hidden">
                <div className={`px-6 py-4 ${isRsvped ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}>
                  <h3 className="text-white font-semibold text-lg">{isRsvped ? "You're Going!" : 'Reserve Your Spot'}</h3>
                  {isRsvped && <p className="text-green-100 text-sm">You have RSVP'd to this event</p>}
                </div>
                <CardContent className="space-y-3 pt-4">
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