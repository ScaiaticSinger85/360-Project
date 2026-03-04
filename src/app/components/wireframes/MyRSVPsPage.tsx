import { PageType } from '../../App';
import { Calendar, MapPin, Users, X, Filter, Star } from 'lucide-react';

interface MyRSVPsPageProps {
  onNavigate: (page: PageType) => void;
}

export function MyRSVPsPage({ onNavigate }: MyRSVPsPageProps) {
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
              <button className="px-3 py-1 font-semibold text-blue-600 underline">
                My RSVPs
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('create-event')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Create Event
            </button>
            <button onClick={() => onNavigate('user-profile')} className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
              JD
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My RSVPs</h1>
            <p className="text-gray-600">Events you're attending</p>
          </div>
          <button className="px-4 py-2 border-2 border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter size={16} />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200 mb-6">
          <div className="flex gap-6">
            <button className="px-4 py-3 border-b-4 border-blue-600 font-semibold text-blue-600">
              Upcoming (4)
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Past (12)
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Cancelled (1)
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {[
            { date: 'Tomorrow', canReview: false },
            { date: 'Next Week', canReview: false },
            { date: 'Jun 15', canReview: false },
            { date: 'Jun 20', canReview: false }
          ].map((event, i) => (
            <div key={i} className="border-2 border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="w-48 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
                  [Image]
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 bg-gray-200 rounded w-64" />
                        {i === 0 && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {event.date}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <div className="h-4 bg-gray-100 rounded w-40" />
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <div className="h-4 bg-gray-100 rounded w-48" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>67 people attending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RSVP Status */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-800 font-medium">RSVP Confirmed</span>
                    <span className="text-xs text-green-600 ml-auto">RSVP'd on Feb 1, 2026</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onNavigate('event-details')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      View Event
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Add to Calendar
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Get Directions
                    </button>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2 ml-auto">
                      <X size={16} />
                      Cancel RSVP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Past Events - Can Review */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Past Events - Leave a Review</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border-2 border-gray-300 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gradient-to-br from-blue-200 to-green-200 rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
                    [Image]
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-64 mb-2" />
                        <div className="space-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <div className="h-4 bg-gray-100 rounded w-40" />
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <div className="h-4 bg-gray-100 rounded w-48" />
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Attended
                      </span>
                    </div>

                    {/* Review Prompt */}
                    <div className="p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={16} className="text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-900">How was this event?</span>
                      </div>
                      <p className="text-xs text-yellow-800">Share your experience to help others</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        Write a Review
                      </button>
                      <button 
                        onClick={() => onNavigate('event-details')}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
