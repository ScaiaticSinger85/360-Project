import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { ArrowLeft, Edit, FileText, Calendar, MapPin, Settings2, ImageIcon, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Music',
  'Food & Drink',
  'Sports & Fitness',
  'Arts & Culture',
  'Technology',
  'Community',
];

const API_URL = 'http://localhost:4000';

type EventType = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  imageUrl: string;
  organizer: string;
  organizerId: string;
  isPublic: boolean;
};

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0 mt-0.5">
        <div className="text-blue-600">{icon}</div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
}

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    address: '',
    capacity: '',
    imageUrl: '',
    isPublic: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load events');
        }

        const foundEvent = data.events.find((e: EventType) => e.id === id);

        if (!foundEvent) {
          setEvent(null);
          setLoading(false);
          return;
        }

        setEvent(foundEvent);
        setFormData({
          title: foundEvent.title,
          description: foundEvent.description,
          category: foundEvent.category,
          date: foundEvent.date,
          time: foundEvent.time,
          location: foundEvent.location,
          address: foundEvent.address,
          capacity: foundEvent.capacity.toString(),
          imageUrl: foundEvent.imageUrl,
          isPublic: foundEvent.isPublic,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim() || formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim() || formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    } else if (parseInt(formData.capacity) > 10000) {
      newErrors.capacity = 'Capacity cannot exceed 10,000';
    }

    if (!formData.imageUrl.trim() || !formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'imageUrl') setImageError(false);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        address: formData.address.trim(),
        capacity: parseInt(formData.capacity),
        imageUrl: formData.imageUrl.trim(),
        isPublic: formData.isPublic,
      };

      const response = await fetch(`${API_URL}/api/events/${event!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update event');
      }

      toast.success('Event updated successfully!');
      navigate(`/events/${event!.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update event');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Event not found</p>
            <Link to="/my-events">
              <Button className="w-full">Back to My Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = user && (event.organizerId === user.id || user.role === 'admin');

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">You don't have permission to edit this event</p>
            <Link to={`/events/${event.id}`}>
              <Button className="w-full">Back to Event</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showImagePreview = formData.imageUrl.startsWith('http') && !imageError;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <Link to={`/events/${event.id}`}>
            <Button variant="ghost" className="mb-4 gap-2 text-white hover:text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Event
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-3">
              <Edit className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Edit Event</h1>
              <p className="text-blue-100 mt-1">Update your event details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                icon={<FileText className="h-5 w-5" />}
                title="Basic Information"
                description="Give your event a name, description, and category"
              />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Music Festival"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={errors.title ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event in detail — what to expect, who should come, what to bring..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className={errors.description ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  <div className="flex justify-between">
                    {errors.description
                      ? <p className="text-sm text-red-600">{errors.description}</p>
                      : <span />
                    }
                    <p className="text-xs text-gray-400 ml-auto">{formData.description.length} chars</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className={errors.category ? 'border-red-400' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                icon={<Calendar className="h-5 w-5" />}
                title="Date & Time"
                description="When is your event taking place?"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={errors.date ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time <span className="text-red-500">*</span></Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className={errors.time ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.time && <p className="text-sm text-red-600">{errors.time}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                icon={<MapPin className="h-5 w-5" />}
                title="Location"
                description="Where will the event be held?"
              />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Venue Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    placeholder="e.g., Waterfront Park"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={errors.location ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    placeholder="e.g., 1600 Abbott St, Kelowna, BC"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={errors.address ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Image */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                icon={<ImageIcon className="h-5 w-5" />}
                title="Event Image"
                description="Add a cover image to make your event stand out"
              />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL <span className="text-red-500">*</span></Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className={errors.imageUrl ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.imageUrl && <p className="text-sm text-red-600">{errors.imageUrl}</p>}
                  <p className="text-xs text-gray-500">
                    Tip: Use <span className="font-medium text-blue-600">unsplash.com</span> for free high-quality photos
                  </p>
                </div>

                <div className={`aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50 transition-all ${showImagePreview ? 'border-transparent' : 'border-gray-200'}`}>
                  {showImagePreview ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                icon={<Settings2 className="h-5 w-5" />}
                title="Additional Details"
                description="Set capacity and visibility for your event"
              />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="e.g., 100"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className={errors.capacity ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                  <div className="flex items-center gap-3">
                    {formData.isPublic
                      ? <Globe className="h-5 w-5 text-green-600" />
                      : <Lock className="h-5 w-5 text-gray-500" />
                    }
                    <div>
                      <p className="font-medium text-sm">{formData.isPublic ? 'Public Event' : 'Private Event'}</p>
                      <p className="text-xs text-gray-500">
                        {formData.isPublic
                          ? 'Visible to everyone on the platform'
                          : 'Only visible to people with the link'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleChange('isPublic', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4 pb-4">
            <Button type="submit" size="lg" className="flex-1 gap-2" disabled={isSubmitting}>
              <Edit className="h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => navigate(`/events/${event.id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
