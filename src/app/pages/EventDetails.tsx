import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  User,
  ArrowLeft,
  Check,
  X,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { events, getRSVP, updateRSVP, createReview, getEventReviews, deleteEvent } = useData();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === id);
  const [userRsvp, setUserRsvp] = useState(user ? getRSVP(id!, user.id) : undefined);
  const [reviews, setReviews] = useState(getEventReviews(id!));
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (user && id) {
      setUserRsvp(getRSVP(id, user.id));
    }
    if (id) {
      setReviews(getEventReviews(id));
    }
  }, [user, id, events]);

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

  const handleRSVP = (status: 'attending' | 'maybe' | 'not-attending') => {
    if (!user) {
      toast.error('Please sign in to RSVP');
      navigate('/sign-in');
      return;
    }

    updateRSVP(event.id, user.id, status);
    setUserRsvp(getRSVP(event.id, user.id));
    toast.success(`RSVP updated to: ${status}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to leave a review');
      navigate('/sign-in');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    createReview({
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment.trim(),
    });

    setReviews(getEventReviews(event.id));
    setComment('');
    setRating(5);
    toast.success('Review submitted!');
  };

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    toast.success('Event deleted successfully');
    navigate('/my-events');
  };

  const isOrganizer = user && event.organizerId === user.id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOrganizer || isAdmin;
  const spotsRemaining = event.capacity - event.attendees;
  const isFull = spotsRemaining <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        {/* Event Image */}
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Category */}
            <div>
              <Badge className="mb-3">{event.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600">
                Organized by <span className="font-semibold">{event.organizerName}</span>
              </p>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">{review.userName}</span>
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
                    No reviews yet. Be the first to review this event!
                  </p>
                )}

                {user && userRsvp?.status === 'attending' && (
                  <>
                    <Separator className="my-6" />
                    <form onSubmit={handleSubmitReview} className="space-y-4">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
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

            {/* RSVP Card */}
            {user && user.role !== 'unregistered' && !isOrganizer && (
              <Card>
                <CardHeader>
                  <CardTitle>RSVP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userRsvp && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">
                        Your current status: {userRsvp.status}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRSVP('attending')}
                    className="w-full gap-2"
                    variant={userRsvp?.status === 'attending' ? 'default' : 'outline'}
                    disabled={isFull && userRsvp?.status !== 'attending'}
                  >
                    <Check className="h-4 w-4" />
                    Attending
                  </Button>

                  <Button
                    onClick={() => handleRSVP('maybe')}
                    className="w-full gap-2"
                    variant={userRsvp?.status === 'maybe' ? 'default' : 'outline'}
                  >
                    Maybe
                  </Button>

                  <Button
                    onClick={() => handleRSVP('not-attending')}
                    className="w-full gap-2"
                    variant={userRsvp?.status === 'not-attending' ? 'default' : 'outline'}
                  >
                    <X className="h-4 w-4" />
                    Can't Go
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

            {/* Edit/Delete for organizers and admins */}
            {canEdit && (
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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full gap-2" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event
                          and all associated RSVPs and reviews.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteEvent}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
