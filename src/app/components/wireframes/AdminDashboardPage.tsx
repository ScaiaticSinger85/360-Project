import { PageType } from '../../App';
import { Users, Calendar, TrendingUp, AlertCircle, BarChart3, Activity } from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: PageType) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-gray-300 bg-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="w-32 h-8 bg-blue-200 rounded flex items-center justify-center text-xs font-bold hover:bg-blue-300">
              LOGO
            </button>
            <div className="hidden md:flex gap-6 text-sm">
              <button className="px-3 py-1 font-semibold text-blue-600 underline">
                Admin Dashboard
              </button>
              <button onClick={() => onNavigate('user-management')} className="px-3 py-1 hover:bg-gray-100 rounded">
                User Management
              </button>
              <button onClick={() => onNavigate('home')} className="px-3 py-1 hover:bg-gray-100 rounded">
                View Site
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('user-profile')} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              AD
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        {/* Alert Banner */}
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900 mb-1">3 events pending review</div>
            <div className="text-sm text-yellow-800">Review flagged events to ensure community guidelines are met.</div>
          </div>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-700">
            Review Now
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+12%</span>
            </div>
            <div className="text-3xl font-bold mb-1">10,234</div>
            <div className="text-gray-600 text-sm">Total Users</div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+8%</span>
            </div>
            <div className="text-3xl font-bold mb-1">548</div>
            <div className="text-gray-600 text-sm">Active Events</div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+24%</span>
            </div>
            <div className="text-3xl font-bold mb-1">25,678</div>
            <div className="text-gray-600 text-sm">Total RSVPs</div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-orange-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold">+5%</span>
            </div>
            <div className="text-3xl font-bold mb-1">89%</div>
            <div className="text-gray-600 text-sm">Avg Attendance</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">User Growth</h2>
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-around p-4 border-2 border-gray-200">
              {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-12 bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-600">W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Categories Distribution */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Events by Category</h2>
            <div className="space-y-4">
              {[
                { category: 'Music', count: 124, color: 'bg-purple-500', percent: 85 },
                { category: 'Sports', count: 98, color: 'bg-blue-500', percent: 67 },
                { category: 'Food & Dining', count: 87, color: 'bg-green-500', percent: 59 },
                { category: 'Technology', count: 76, color: 'bg-orange-500', percent: 52 },
                { category: 'Arts & Culture', count: 65, color: 'bg-pink-500', percent: 44 },
                { category: 'Outdoors', count: 54, color: 'bg-teal-500', percent: 37 },
              ].map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-gray-600">{item.count} events</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Events</h2>
              <button 
                onClick={() => onNavigate('event-browse')}
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Pending Reviews</h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                3 pending
              </span>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Flagged Event', reason: 'Inappropriate content reported' },
                { type: 'New Organizer', reason: 'Account verification needed' },
                { type: 'Event Update', reason: 'Major changes to published event' }
              ].map((item, i) => (
                <div key={i} className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm mb-1">{item.type}</div>
                      <div className="text-xs text-gray-600">{item.reason}</div>
                    </div>
                    <span className="px-2 py-1 bg-orange-600 text-white rounded text-xs font-medium">
                      New
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700">
                      Approve
                    </button>
                    <button className="flex-1 py-2 border-2 border-gray-300 rounded text-sm font-semibold hover:bg-gray-50">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('user-management')}
            className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="font-semibold">Manage Users</div>
          </button>
          <button className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div className="font-semibold">Manage Events</div>
          </button>
          <button className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <BarChart3 size={24} className="text-green-600" />
            </div>
            <div className="font-semibold">View Reports</div>
          </button>
          <button className="p-6 bg-white border-2 border-gray-300 rounded-lg hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
            <div className="font-semibold">System Alerts</div>
          </button>
        </div>
      </div>
    </div>
  );
}
