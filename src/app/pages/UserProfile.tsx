import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';

export default function UserProfile() {
  const { user, updateProfile, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
      setAvatarFile(null);
    }
  }, [user]);

  const previewUrl = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }

    return user?.avatarUrl || undefined;
  }, [avatarFile, user]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getInitials = (name: string) => {
    if (!name.trim()) return 'U';

    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (!user) return;

    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
    });
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);

    const result = await updateProfile({
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      avatarFile,
    });

    setIsSaving(false);

    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setAvatarFile(null);
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Please sign in to view your profile</p>
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={previewUrl}
                    alt={formData.name || 'Profile image'}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={!isEditing || isSaving}
                  className={!isEditing ? 'bg-gray-50 cursor-default' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50 cursor-default"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Image</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  disabled={!isEditing || isSaving}
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
                />
                <p className="text-xs text-gray-500">Upload a new profile image</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={!isEditing || isSaving}
                  className={!isEditing ? 'bg-gray-50 cursor-default' : ''}
                />
              </div>

              <div className="flex gap-4">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={handleSaveClick}
                      className="flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelClick}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">User ID</span>
                <span className="font-mono text-sm">{user.id}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Role</span>
                <span className="font-semibold capitalize">{user.role}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-600">Member Since</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}