import { PageType } from '../App';
import { ArrowRight, Users, UserCheck, ShieldCheck, MousePointerClick } from 'lucide-react';

interface NavigationFlowProps {
  onNavigate: (page: PageType) => void;
}

export function NavigationFlow({ onNavigate }: NavigationFlowProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Navigation Structure & User Flows</h1>
        <p className="text-xl text-gray-600 mb-2">Kelowna Events Management & RSVP System</p>
        <p className="text-gray-500">Click on any page to view its wireframe</p>
      </div>

      {/* User Type Legend */}
      <div className="mb-12 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <Users size={20} className="text-gray-600" />
          <span className="font-semibold">Unregistered User</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
          <UserCheck size={20} className="text-blue-600" />
          <span className="font-semibold">Registered User</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
          <ShieldCheck size={20} className="text-red-600" />
          <span className="font-semibold">Admin User</span>
        </div>
      </div>

      {/* Unregistered User Flow */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Unregistered User Flow</h2>
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => onNavigate('home')}
                className="group relative px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-sm font-semibold mb-1">Home Page</div>
                <div className="text-xs text-gray-600">Landing, search, featured events</div>
                <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
              </button>
              
              <ArrowRight size={24} className="text-gray-400 flex-shrink-0" />
              
              <button
                onClick={() => onNavigate('event-browse')}
                className="group relative px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-sm font-semibold mb-1">Browse Events</div>
                <div className="text-xs text-gray-600">Search, filter, view events</div>
                <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
              </button>
              
              <ArrowRight size={24} className="text-gray-400 flex-shrink-0" />
              
              <button
                onClick={() => onNavigate('event-details')}
                className="group relative px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-sm font-semibold mb-1">Event Details</div>
                <div className="text-xs text-gray-600">View info, reviews (can't RSVP)</div>
                <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
              </button>
            </div>

            {/* Auth Flow */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">To RSVP or create events:</div>
                <div className="flex gap-4">
                  <button
                    onClick={() => onNavigate('sign-in')}
                    className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="text-sm font-semibold mb-1">Sign In</div>
                    <div className="text-xs text-gray-600">Existing users</div>
                    <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                  </button>
                  
                  <button
                    onClick={() => onNavigate('sign-up')}
                    className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="text-sm font-semibold mb-1">Sign Up</div>
                    <div className="text-xs text-gray-600">New users</div>
                    <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registered User Flow */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <UserCheck size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Registered User Flow</h2>
        </div>
        <div className="bg-white border-2 border-blue-300 rounded-lg p-8">
          <div className="space-y-8">
            {/* Core Navigation */}
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-4">Main Navigation (accessible from any page)</div>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => onNavigate('home')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Home</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <button
                  onClick={() => onNavigate('event-browse')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Browse Events</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <button
                  onClick={() => onNavigate('my-events')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">My Events</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <button
                  onClick={() => onNavigate('my-rsvps')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">My RSVPs</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <button
                  onClick={() => onNavigate('user-profile')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Profile</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
              </div>
            </div>

            {/* Event Creation Flow */}
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-4">Event Creation & Management Flow</div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => onNavigate('create-event')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Create Event</div>
                  <div className="text-xs text-gray-600">Form with validation</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <ArrowRight size={24} className="text-blue-400 flex-shrink-0" />
                
                <button
                  onClick={() => onNavigate('my-events')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">My Events</div>
                  <div className="text-xs text-gray-600">Manage created events</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <ArrowRight size={24} className="text-blue-400 flex-shrink-0" />
                
                <button
                  onClick={() => onNavigate('edit-event')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Edit Event</div>
                  <div className="text-xs text-gray-600">Update event details</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
              </div>
            </div>

            {/* RSVP Flow */}
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-4">RSVP & Attendance Flow</div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => onNavigate('event-browse')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Browse Events</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <ArrowRight size={24} className="text-blue-400 flex-shrink-0" />
                
                <button
                  onClick={() => onNavigate('event-details')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Event Details</div>
                  <div className="text-xs text-gray-600">RSVP available</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <ArrowRight size={24} className="text-blue-400 flex-shrink-0" />
                
                <button
                  onClick={() => onNavigate('my-rsvps')}
                  className="group relative px-6 py-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">My RSVPs</div>
                  <div className="text-xs text-gray-600">View & manage RSVPs</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-blue-500" />
                </button>
                
                <ArrowRight size={24} className="text-blue-400 flex-shrink-0" />
                
                <div className="px-6 py-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="text-sm font-semibold mb-1">After Event</div>
                  <div className="text-xs text-gray-600">Leave review & rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin User Flow */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Admin User Flow</h2>
        </div>
        <div className="bg-white border-2 border-red-300 rounded-lg p-8">
          <div className="space-y-8">
            <div>
              <div className="text-sm font-semibold text-red-600 mb-4">Admin has access to all Registered User features PLUS:</div>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="group relative px-6 py-4 bg-red-50 border-2 border-red-300 rounded-lg hover:border-red-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">Admin Dashboard</div>
                  <div className="text-xs text-gray-600">Stats, analytics, pending reviews</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-red-500" />
                </button>
                
                <ArrowRight size={24} className="text-red-400 flex-shrink-0" />
                
                <button
                  onClick={() => onNavigate('user-management')}
                  className="group relative px-6 py-4 bg-red-50 border-2 border-red-300 rounded-lg hover:border-red-500 hover:shadow-lg transition-all"
                >
                  <div className="text-sm font-semibold mb-1">User Management</div>
                  <div className="text-xs text-gray-600">Manage users, roles, permissions</div>
                  <MousePointerClick size={16} className="absolute top-2 right-2 text-gray-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-red-600 mb-4">Admin Capabilities</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="font-semibold mb-2">Platform Management</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• View platform statistics</li>
                    <li>• Monitor user activity</li>
                    <li>• Review flagged content</li>
                    <li>• Manage system alerts</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="font-semibold mb-2">User Management</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Grant/revoke admin access</li>
                    <li>• Suspend/activate users</li>
                    <li>• Review new organizers</li>
                    <li>• Send bulk communications</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="font-semibold mb-2">Event Oversight</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Approve/reject events</li>
                    <li>• Edit any event</li>
                    <li>• Remove inappropriate events</li>
                    <li>• View all event analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Key Features & Navigation Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
            <h3 className="font-bold mb-3">Event Discovery</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Search by keywords, location, date</li>
              <li>• Filter by category, price</li>
              <li>• View featured events on home</li>
              <li>• Browse all events with pagination</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
            <h3 className="font-bold mb-3">Event Details</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Complete event information</li>
              <li>• Organizer profile & ratings</li>
              <li>• Reviews & ratings display</li>
              <li>• Map integration</li>
              <li>• RSVP functionality (registered)</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
            <h3 className="font-bold mb-3">Authentication</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Email/password login</li>
              <li>• Social authentication (Google, Facebook)</li>
              <li>• Registration with validation</li>
              <li>• Persistent login sessions</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
            <h3 className="font-bold mb-3">Event Management</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Multi-step event creation form</li>
              <li>• Image upload with preview</li>
              <li>• Draft saving</li>
              <li>• Edit/delete events</li>
              <li>• View attendee lists</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
            <h3 className="font-bold mb-3">RSVP System</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• One-click RSVP</li>
              <li>• Capacity tracking</li>
              <li>• Calendar integration</li>
              <li>• RSVP management</li>
              <li>• Email notifications</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
            <h3 className="font-bold mb-3">Reviews & Ratings</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 5-star rating system</li>
              <li>• Written reviews</li>
              <li>• Organizer reputation</li>
              <li>• Review past attended events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
