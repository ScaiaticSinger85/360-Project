import { PageType, UserType } from '../../App';
import { Calendar, MapPin, Users, Star, Share2, Heart, Flag } from 'lucide-react';

interface EventDetailsPageProps {
  onNavigate: (page: PageType) => void;
  userType: UserType;
}

export function EventDetailsPage({ onNavigate, userType }: EventDetailsPageProps) {
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

      {/* Event Hero Image */}
      <div className="h-96 bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-gray-600 text-xl">
        [Event Hero Image]
      </div>

      {/* Event Details */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Music
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Free
                </span>
              </div>
              
              <div className="h-10 bg-gray-200 rounded mb-4" />
              
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <div className="h-5 bg-gray-100 rounded w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span className="font-semibold">67 attending</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={20} />
                <div className="h-5 bg-gray-100 rounded w-64" />
              </div>

              <div className="flex gap-3">
                <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart size={20} />
                </button>
                <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 size={20} />
                </button>
                <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  <Flag size={20} />
                </button>
              </div>
            </div>

            {/* About */}
            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-4/6" />
              </div>
            </div>

            {/* Organizer */}
            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg">
                <div className="w-16 h-16 bg-gray-300 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={16} fill="currentColor" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-gray-500 ml-1">(24 reviews)</span>
                  </div>
                </div>
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  Contact
                </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
              <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">4.8</div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">18 reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400"
                          style={{ width: `${stars === 5 ? '70' : stars === 4 ? '20' : '10'}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-600">{stars === 5 ? '13' : stars === 4 ? '3' : '2'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">2 days ago</div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded" />
                          <div className="h-3 bg-gray-100 rounded w-4/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - RSVP Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold mb-2">FREE</div>
                <div className="text-sm text-gray-600">67 people attending</div>
              </div>

              {userType === 'unregistered' ? (
                <div>
                  <button 
                    onClick={() => onNavigate('sign-in')}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mb-3"
                  >
                    Sign In to RSVP
                  </button>
                  <p className="text-xs text-center text-gray-600">
                    Create an account to RSVP and receive event updates
                  </p>
                </div>
              ) : (
                <div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mb-3">
                    RSVP Now
                  </button>
                  <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-white">
                    Add to Calendar
                  </button>
                </div>
              )}

              {/* Event Info */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2">Date & Time</div>
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Location</div>
                  <div className="h-4 bg-gray-200 rounded mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Capacity</div>
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6">
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  [Map]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
