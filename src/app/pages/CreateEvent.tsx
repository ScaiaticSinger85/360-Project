import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { ArrowLeft, CalendarPlus, FileText, Calendar, MapPin, Settings2, ImageIcon, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizePlainText } from '../utils/security';

const CATEGORIES = [
  'Music',
  'Food & Drink',
  'Sports & Fitness',
  'Arts & Culture',
  'Technology',
  'Community',
];

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

export default function CreateEvent() {
  const { user } = useAuth();
  const { createEvent } = useData();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    date: '',
    time: '',
    location: '',
    address: '',
    capacity: '25',
    isPublic: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageUrl.startsWith('http') && !imageError) return imageUrl;
    return null;
  }, [imageFile, imageUrl, imageError]);

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
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    const cap = parseInt(formData.capacity);
    if (!formData.capacity || cap <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    } else if (cap > 10000) {
      newErrors.capacity = 'Capacity cannot exceed 10,000';
    }

    if (imageUrl.trim() && !imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Please enter a valid URL starting with http';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await createEvent({
        title: sanitizePlainText(formData.title.trim()),
        description: sanitizePlainText(formData.description.trim()),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: sanitizePlainText(formData.location.trim()),
        address: sanitizePlainText(formData.address.trim()),
        capacity: parseInt(formData.capacity),
        imageUrl: imageUrl.trim(),
        imageFile,
        isPublic: formData.isPublic,
      });

      toast.success('Event created successfully!');
      navigate('/my-events');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <Link to="/my-events">
            <Button variant="ghost" className="mb-4 gap-2 text-white hover:text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to My Events
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-3">
              <CalendarPlus className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create New Event</h1>
              <p className="text-blue-100 mt-1">Fill in the details to publish your event to the community</p>
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
                  <Label htmlFor="imageFile">Upload Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => { setImageFile(e.target.files?.[0] || null); setImageError(false); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Or Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => { setImageUrl(e.target.value); setImageError(false); }}
                    className={errors.imageUrl ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  />
                  {errors.imageUrl && <p className="text-sm text-red-600">{errors.imageUrl}</p>}
                  <p className="text-xs text-gray-500">
                    Optional — if you don't add one, a default image will be used based on your event's category. Tip: Use <span className="font-medium text-blue-600">unsplash.com</span> for free high-quality photos.
                  </p>
                </div>

                <div className={`aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50 transition-all ${previewUrl ? 'border-transparent' : 'border-gray-200'}`}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
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
              <CalendarPlus className="h-5 w-5" />
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => navigate('/my-events')}
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
