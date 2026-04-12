import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizePlainText } from '../utils/security';

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const { events, updateEvent } = useData();
  const navigate = useNavigate();
  const event = events.find((entry) => entry.id === id);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    date: '',
    time: '',
    location: '',
    address: '',
    capacity: '25',
    isPublic: true,
  });

  useEffect(() => {
    if (!event) return;

    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      address: event.address,
      capacity: String(event.capacity),
      isPublic: event.isPublic,
    });
    setImageUrl(event.imageUrl);
  }, [event]);

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl;
  }, [imageFile, imageUrl]);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Event not found.</div>;
  }

  if (!user || (user.id !== event.organizerId && user.role !== 'admin')) {
    return <div className="min-h-screen flex items-center justify-center">You do not have permission to edit this event.</div>;
  }

  const handleSubmit = async (entry: React.FormEvent) => {
    entry.preventDefault();
    setIsSubmitting(true);

    try {
      await updateEvent(event.id, {
        title: sanitizePlainText(formData.title),
        description: sanitizePlainText(formData.description),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: sanitizePlainText(formData.location),
        address: sanitizePlainText(formData.address),
        capacity: Number(formData.capacity),
        imageUrl: imageUrl.trim(),
        imageFile,
        isPublic: formData.isPublic,
      });

      toast.success('Event updated successfully.');
      navigate(`/events/${event.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update event.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/events/${event.id}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData((previous) => ({ ...previous, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={5} value={formData.description} onChange={(e) => setFormData((previous) => ({ ...previous, description: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData((previous) => ({ ...previous, category: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => setFormData((previous) => ({ ...previous, capacity: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData((previous) => ({ ...previous, date: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={(e) => setFormData((previous) => ({ ...previous, time: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Venue</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData((previous) => ({ ...previous, location: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData((previous) => ({ ...previous, address: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageFile">Replace Image</Label>
                <Input id="imageFile" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Or Image URL</Label>
                <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              {previewUrl ? <img src={previewUrl} alt="Event preview" className="h-64 w-full rounded-lg border object-cover" /> : null}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Public Event</p>
                  <p className="text-sm text-muted-foreground">Keep the event visible to all users.</p>
                </div>
                <Switch checked={formData.isPublic} onCheckedChange={(checked) => setFormData((previous) => ({ ...previous, isPublic: checked }))} />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/events/${event.id}`)}>
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
