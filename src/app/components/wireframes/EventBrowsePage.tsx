import { PageType, UserType } from '../../App';
import { Search, Filter, Calendar, MapPin, Users, Star } from 'lucide-react';

interface EventBrowsePageProps {
  onNavigate: (page: PageType) => void;
  userType: UserType;
}

export function EventBrowsePage({ onNavigate, userType }: EventBrowsePageProps) {
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
              <button className="px-3 py-1 font-semibold text-blue-600 underline">
                Browse Events
              </button>
              {(userType === 'registered' || userType === 'admin') && (
                <>
                  <button onClick={() => onNavigate('my-events')} className="px-3 py-1 hover:bg-gray-100 rounded">
                    My Events
                  </button>
                  <button onClick={() => onNavigate('my-rsvps')} className="px-3 py-1 hover:bg-gray-100 rounded">
                    My RSVPs
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {userType === 'unregistered' ? (
              <>
                <button onClick={() => onNavigate('sign-in')} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  Sign In
                </button>
                <button onClick={() => onNavigate('sign-up')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('create-event')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Create Event
                </button>
                <button onClick={() => onNavigate('user-profile')} className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  JD
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 p-6 border-b-2 border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Search events by name, location, or keyword...</span>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Search
            </button>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg flex items-center gap-2 hover:border-blue-500">
              <Filter size={16} />
              <span className="text-sm">Filters</span>
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm hover:border-blue-500">
              Date Range
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm hover:border-blue-500">
              Category
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm hover:border-blue-500">
              Location
            </button>
            <button className="px-4 py-2 bg-blue-100 border-2 border-blue-500 text-blue-700 rounded-lg text-sm font-medium">
              Music ×
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Browse Events</h1>
          <span className="text-gray-600">124 events found</span>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => onNavigate('event-details')}
              className="w-full border-2 border-gray-300 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition-all text-left"
            >
              <div className="flex gap-4">
                <div className="w-48 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
                  [Image]
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-64 mb-2" />
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <div className="h-4 bg-gray-100 rounded w-32" />
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <div className="h-4 bg-gray-100 rounded w-40" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-100 rounded mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>45 attending</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Music
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Free
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
            1
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
