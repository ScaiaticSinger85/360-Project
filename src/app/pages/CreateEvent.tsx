import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Music',
  'Food & Drink',
  'Sports & Fitness',
  'Arts & Culture',
  'Technology',
  'Community',
];

export default function CreateEvent() {
  const { user } = useAuth();
  const { createEvent } = useData();
  const navigate = useNavigate();

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

  if (!user || user.role === 'unregistered') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Please sign in to create events</p>
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Event date must be in the future';
      }
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

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const newEvent = createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        address: formData.address.trim(),
        capacity: parseInt(formData.capacity),
        imageUrl: formData.imageUrl.trim(),
        organizerId: user.id,
        organizerName: user.name,
        isPublic: formData.isPublic,
      });

      toast.success('Event created successfully!');
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      toast.error('Failed to create event');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/my-events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Events
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Event</CardTitle>
            <CardDescription>
              Fill out the form below to create a new event in Kelowna
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Music Festival"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-600">{errors.time}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Venue Name *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Waterfront Park"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="e.g., 1600 Abbott St, Kelowna, BC V1Y 1A9"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Event Image URL *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-600">{errors.imageUrl}</p>
                )}
                <p className="text-xs text-gray-500">
                  Tip: Use Unsplash.com for free event images
                </p>
              </div>

              {/* Public/Private */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Event</Label>
                  <p className="text-sm text-gray-500">
                    Make this event visible to all users
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleChange('isPublic', checked)}
                />
              </div>

              {/* Info Alert */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All fields marked with * are required. Please ensure all information is accurate.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/my-events')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
