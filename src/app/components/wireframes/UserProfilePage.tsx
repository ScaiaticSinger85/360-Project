import { PageType } from '../../App';
import { User, Mail, MapPin, Calendar, Star, Edit2, Camera } from 'lucide-react';

interface UserProfilePageProps {
  onNavigate: (page: PageType) => void;
}

export function UserProfilePage({ onNavigate }: UserProfilePageProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-gray-300 bg-gray-50 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="w-32 h-8 bg-blue-200 rounded flex items-center justify-center text-xs font-bold hover:bg-blue-300">
              LOGO
            </button>
            <div className="hidden md:flex gap-6 text-sm">
              <button onClick={() => onNavigate('home')} className="px-3 py-1 hover:bg-gray-100 rounded">
                Home
              </button>
              <button onClick={() => onNavigate('event-browse')} className="px-3 py-1 hover:bg-gray-100 rounded">
                Browse Events
              </button>
              <button onClick={() => onNavigate('my-events')} className="px-3 py-1 hover:bg-gray-100 rounded">
                My Events
              </button>
              <button onClick={() => onNavigate('my-rsvps')} className="px-3 py-1 hover:bg-gray-100 rounded">
                My RSVPs
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('create-event')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Create Event
            </button>
            <button className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs border-2 border-blue-500">
              JD
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-6 -mt-24 mb-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-48 h-48 bg-gray-300 rounded-full border-8 border-white flex items-center justify-center text-5xl font-bold text-gray-600">
                JD
              </div>
              <button className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 border-4 border-white">
                <Camera size={20} />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 mt-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">John Doe</h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Event Organizer
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span className="text-sm">john.doe@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span className="text-sm">Kelowna, BC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm">Joined Jan 2025</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={20} className="text-yellow-500" fill="currentColor" />
                  <span className="text-xl font-bold">4.9</span>
                  <span className="text-gray-600 ml-1">(24 reviews)</span>
                </div>
              </div>
              <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">34</div>
                <div className="text-sm text-gray-600">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">456</div>
                <div className="text-sm text-gray-600">Total Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">89</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200 mb-6">
          <div className="flex gap-6">
            <button className="px-4 py-3 border-b-4 border-blue-600 font-semibold text-blue-600">
              About
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Events
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Reviews
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Settings
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <div className="space-y-3 text-gray-700">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Interests */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {['Music', 'Sports', 'Technology', 'Food & Dining', 'Outdoors', 'Arts & Culture'].map((interest) => (
                  <span key={interest} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Created', event: 'Summer Jazz Festival', time: '2 days ago' },
                  { action: 'RSVP\'d to', event: 'Tech Meetup 2026', time: '5 days ago' },
                  { action: 'Reviewed', event: 'Food Truck Friday', time: '1 week ago' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.action}</span> {activity.event}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="font-bold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Email</div>
                  <div className="font-medium">john.doe@email.com</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Location</div>
                  <div className="font-medium">Kelowna, BC</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Member Since</div>
                  <div className="font-medium">January 2025</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="font-bold mb-4">Badges & Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Top Organizer</div>
                    <div className="text-xs text-gray-600">10+ events created</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
                    ⭐
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Community Star</div>
                    <div className="text-xs text-gray-600">30+ events attended</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
                    ✍️
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Helpful Reviewer</div>
                    <div className="text-xs text-gray-600">20+ reviews written</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
