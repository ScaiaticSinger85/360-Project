import { PageType } from '../../App';
import { Calendar, MapPin, Users, Image, DollarSign, Tag, AlertCircle } from 'lucide-react';

interface CreateEventPageProps {
  onNavigate: (page: PageType) => void;
}

export function CreateEventPage({ onNavigate }: CreateEventPageProps) {
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1 h-1 bg-blue-600 rounded" />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded" />
          </div>
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
            3
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Event Information</h2>

          {/* Event Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Event Title *
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-3">
              <span className="text-gray-400 text-sm">Enter event title</span>
            </div>
          </div>

          {/* Event Image */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Event Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <Image size={48} className="text-gray-400" />
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Click to upload or drag and drop</div>
                <div className="text-xs text-gray-500">PNG, JPG up to 10MB</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-3 h-32">
              <span className="text-gray-400 text-sm">Describe your event...</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">0 / 500 characters</div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Start Date & Time *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Select date and time</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                End Date & Time *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Select date and time</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Location *
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Enter venue address</span>
            </div>
            <div className="h-48 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-500">
              [Map Preview]
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Tag size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Select category</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Capacity *
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
                <Users size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Max attendees</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Ticket Price
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                </div>
                <span className="text-sm">Free Event</span>
              </label>
              <label className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                <span className="text-sm">Paid Event</span>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Tip:</strong> Add detailed descriptions and high-quality images to attract more attendees.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t-2 border-gray-200">
            <button 
              onClick={() => onNavigate('my-events')}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Save as Draft
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
