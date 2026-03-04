import { PageType } from '../../App';
import { Calendar, MapPin, Users, Image, DollarSign, Tag, AlertCircle, Save } from 'lucide-react';

interface EditEventPageProps {
  onNavigate: (page: PageType) => void;
}

export function EditEventPage({ onNavigate }: EditEventPageProps) {
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
            <button onClick={() => onNavigate('user-profile')} className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
              JD
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
            <p className="text-gray-600">Update your event details</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate('my-events')}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          {/* Event Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Event Title *
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-3">
              <span className="text-gray-700">Summer Jazz Festival 2026</span>
            </div>
          </div>

          {/* Event Image */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Event Image *
            </label>
            <div className="relative">
              <div className="h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-gray-600 mb-2">
                [Current Event Image]
              </div>
              <button className="w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Image size={20} />
                <span className="font-medium">Change Image</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-3 h-32">
              <span className="text-gray-700 text-sm">Join us for an amazing evening of live jazz music featuring local and international artists...</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">156 / 500 characters</div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Start Date & Time *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <span className="text-gray-700 text-sm">Jun 15, 2026 7:00 PM</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                End Date & Time *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <span className="text-gray-700 text-sm">Jun 15, 2026 11:00 PM</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Location *
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-gray-600" />
              <span className="text-gray-700 text-sm">Waterfront Park, 123 Lake Ave, Kelowna, BC</span>
            </div>
            <div className="h-48 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-500">
              [Map Preview with Pin]
            </div>
          </div>

          {/* Category & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Tag size={20} className="text-gray-600" />
                <span className="text-gray-700 text-sm">Music</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Capacity *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Users size={20} className="text-gray-600" />
                <span className="text-gray-700 text-sm">100</span>
              </div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="font-semibold mb-3">Current Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">45</div>
                <div className="text-sm text-gray-600">RSVPs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">234</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Saves</div>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <strong>Note:</strong> Changes to event date, time, or location will notify all attendees via email.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between pt-6 border-t-2 border-gray-200">
            <button className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50">
              Delete Event
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigate('my-events')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
