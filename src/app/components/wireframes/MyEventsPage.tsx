import { PageType } from '../../App';
import { Calendar, MapPin, Users, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';

interface MyEventsPageProps {
  onNavigate: (page: PageType) => void;
}

export function MyEventsPage({ onNavigate }: MyEventsPageProps) {
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
              <button className="px-3 py-1 font-semibold text-blue-600 underline">
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
            <h1 className="text-3xl font-bold mb-2">My Events</h1>
            <p className="text-gray-600">Manage your created events</p>
          </div>
          <button 
            onClick={() => onNavigate('create-event')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            + New Event
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200 mb-6">
          <div className="flex gap-6">
            <button className="px-4 py-3 border-b-4 border-blue-600 font-semibold text-blue-600">
              Published (3)
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Drafts (1)
            </button>
            <button className="px-4 py-3 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
              Past Events (7)
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {[
            { status: 'active', attendees: 45, capacity: 100 },
            { status: 'active', attendees: 23, capacity: 50 },
            { status: 'upcoming', attendees: 12, capacity: 75 }
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {event.status === 'active' ? 'Active' : 'Upcoming'}
                        </span>
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
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-gray-600" />
                      <span className="font-semibold">{event.attendees}/{event.capacity}</span>
                      <span className="text-gray-600">attendees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye size={16} className="text-gray-600" />
                      <span className="font-semibold">234</span>
                      <span className="text-gray-600">views</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Capacity</span>
                      <span>{Math.round((event.attendees / event.capacity) * 100)}% full</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600"
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onNavigate('event-details')}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button 
                      onClick={() => onNavigate('edit-event')}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                      View RSVPs
                    </button>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (hidden when there are events) */}
        {/* <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No events yet</h3>
          <p className="text-gray-600 mb-6">Create your first event to get started</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Create Event
          </button>
        </div> */}
      </div>
    </div>
  );
}
