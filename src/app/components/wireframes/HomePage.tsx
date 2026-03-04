import { PageType, UserType } from '../../App';
import { Search, Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { Header } from "../Header";
interface HomePageProps {
  onNavigate: (page: PageType) => void;
  userType: UserType;
}

export function HomePage({ onNavigate, userType }: HomePageProps) {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b-2 border-gray-300 bg-gray-50 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="w-32 h-8 bg-blue-200 rounded flex items-center justify-center text-xs font-bold">
              LOGO
            </div>
            <div className="hidden md:flex gap-6 text-sm">
              <button 
                onClick={() => onNavigate('home')}
                className="px-3 py-1 font-semibold text-blue-600 underline"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('event-browse')}
                className="px-3 py-1 hover:bg-gray-100 rounded"
              >
                Browse Events
              </button>
              {(userType === 'registered' || userType === 'admin') && (
                <>
                  <button 
                    onClick={() => onNavigate('my-events')}
                    className="px-3 py-1 hover:bg-gray-100 rounded"
                  >
                    My Events
                  </button>
                  <button 
                    onClick={() => onNavigate('my-rsvps')}
                    className="px-3 py-1 hover:bg-gray-100 rounded"
                  >
                    My RSVPs
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {userType === 'unregistered' ? (
              <>
                <button 
                  onClick={() => onNavigate('sign-in')}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('sign-up')}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {(userType === 'registered' || userType === 'admin') && (
                  <button 
                    onClick={() => onNavigate('create-event')}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Event
                  </button>
                )}
                <button 
                  onClick={() => onNavigate('user-profile')}
                  className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs"
                >
                  JD
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-gray-800 text-white rounded-lg mb-6 flex items-center justify-center text-2xl font-bold">
            HERO HEADING
          </div>
          <div className="h-6 bg-gray-600 text-white rounded mb-8 flex items-center justify-center">
            Hero subheading text
          </div>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex gap-2">
            <div className="flex-1 border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Search events...</span>
            </div>
            <button 
              onClick={() => onNavigate('event-browse')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <button 
            onClick={() => onNavigate('event-browse')}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => onNavigate('event-details')}
              className="border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow text-left"
            >
              <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-gray-600">
                [Event Image]
              </div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <div className="h-4 bg-gray-100 rounded flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <div className="h-4 bg-gray-100 rounded flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <div className="h-4 bg-gray-100 rounded flex-1" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Browse Events', 'RSVP', 'Attend & Review'].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                  {i + 1}
                </div>
                <h3 className="font-bold mb-2">{step}</h3>
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Categories */}
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Music', 'Sports', 'Food', 'Arts', 'Tech', 'Outdoors', 'Community', 'Education'].map((cat) => (
            <button
              key={cat}
              onClick={() => onNavigate('event-browse')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2" />
              <div className="font-semibold">{cat}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Active Events', value: '500+' },
              { label: 'Community Members', value: '10K+' },
              { label: 'Total RSVPs', value: '25K+' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {['About', 'Help', 'Contact', 'Newsletter'].map((section) => (
              <div key={section}>
                <h3 className="font-bold mb-3">{section}</h3>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-300">
            © 2026 Kelowna Events. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
