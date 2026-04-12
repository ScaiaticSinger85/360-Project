import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const CATEGORIES = ['Music', 'Food & Drink', 'Sports & Fitness', 'Arts & Culture', 'Technology', 'Community'];

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

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl;
  }, [imageFile, imageUrl]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="mb-4 text-center">Please sign in to create events.</p>
            <Link to="/sign-in"><Button className="w-full">Sign In</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await createEvent({
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

      toast.success('Event created successfully.');
      navigate('/my-events');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create event.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/my-events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Events
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create Event</CardTitle>
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
                  <select
                    id="category"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={formData.category}
                    onChange={(e) => setFormData((previous) => ({ ...previous, category: e.target.value }))}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => setFormData((previous) => ({ ...previous, capacity: e.target.value }))} required />
                </div>
              </div>

              <div className="space-y-4">
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
                <Label htmlFor="imageFile">Event Image Upload</Label>
                <Input id="imageFile" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Or Image URL</Label>
                <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
              </div>

              {previewUrl ? (
                <div className="overflow-hidden rounded-lg border">
                  <img src={previewUrl} alt="Event preview" className="h-64 w-full object-cover" />
                </div>
              ) : null}

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Public Event</p>
                  <p className="text-sm text-muted-foreground">Allow the event to appear in the public event feed.</p>
                </div>
                <Switch checked={formData.isPublic} onCheckedChange={(checked) => setFormData((previous) => ({ ...previous, isPublic: checked }))} />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/my-events')}>
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
