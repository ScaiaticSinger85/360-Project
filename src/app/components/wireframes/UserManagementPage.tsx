import { PageType } from '../../App';
import { Search, Filter, MoreVertical, Shield, UserX, Mail, Calendar, AlertCircle } from 'lucide-react';

interface UserManagementPageProps {
  onNavigate: (page: PageType) => void;
}

export function UserManagementPage({ onNavigate }: UserManagementPageProps) {
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
              <button onClick={() => onNavigate('admin-dashboard')} className="px-3 py-1 hover:bg-gray-100 rounded">
                Admin Dashboard
              </button>
              <button className="px-3 py-1 font-semibold text-blue-600 underline">
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

      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="text-2xl font-bold mb-1">10,234</div>
            <div className="text-gray-600 text-sm">Total Users</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="text-2xl font-bold mb-1">9,987</div>
            <div className="text-gray-600 text-sm">Regular Users</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="text-2xl font-bold mb-1">245</div>
            <div className="text-gray-600 text-sm">Event Organizers</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="text-2xl font-bold mb-1">2</div>
            <div className="text-gray-600 text-sm">Administrators</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Search by name, email, or ID...</span>
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
              Role
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm hover:border-blue-500">
              Status
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm hover:border-blue-500">
              Join Date
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-2 border-gray-300 rounded-t-lg">
          <div className="border-b-2 border-gray-200 px-6">
            <div className="flex gap-6">
              <button className="px-4 py-4 border-b-4 border-blue-600 font-semibold text-blue-600">
                All Users (10,234)
              </button>
              <button className="px-4 py-4 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
                Organizers (245)
              </button>
              <button className="px-4 py-4 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
                Suspended (12)
              </button>
              <button className="px-4 py-4 border-b-4 border-transparent font-semibold text-gray-600 hover:text-gray-900">
                Pending Review (3)
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-4 border-b-2 border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-1">Events</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* User Rows */}
          <div className="divide-y-2 divide-gray-200">
            {[
              { name: 'John Doe', email: 'john.doe@email.com', role: 'Organizer', status: 'active', events: 12, joined: 'Jan 2025' },
              { name: 'Sarah Smith', email: 'sarah.s@email.com', role: 'User', status: 'active', events: 5, joined: 'Feb 2025' },
              { name: 'Mike Johnson', email: 'mike.j@email.com', role: 'Organizer', status: 'active', events: 8, joined: 'Dec 2024' },
              { name: 'Emily Brown', email: 'emily.b@email.com', role: 'User', status: 'active', events: 15, joined: 'Nov 2024' },
              { name: 'David Lee', email: 'david.l@email.com', role: 'User', status: 'suspended', events: 3, joined: 'Jan 2026' },
            ].map((user, i) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* User Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{user.name}</div>
                      <div className="text-xs text-gray-600 truncate">{user.email}</div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Organizer' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {user.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </div>

                  {/* Joined Date */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {user.joined}
                  </div>

                  {/* Events Count */}
                  <div className="col-span-1 text-sm font-semibold">
                    {user.events}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t-2 border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1-5 of 10,234 users
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm">
                1
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                2
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                3
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="mt-6 bg-white border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Shield size={24} className="text-blue-600" />
              </div>
              <div className="text-sm font-semibold">Grant Admin</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <UserX size={24} className="text-red-600" />
              </div>
              <div className="text-sm font-semibold">Suspend User</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Mail size={24} className="text-green-600" />
              </div>
              <div className="text-sm font-semibold">Send Email</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <div className="text-sm font-semibold">View Events</div>
            </button>
          </div>
        </div>

        {/* Pending Actions Alert */}
        <div className="mt-6 bg-orange-50 border-2 border-orange-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-orange-900 mb-1">3 accounts pending review</div>
            <div className="text-sm text-orange-800">Review new organizer applications and verify their credentials.</div>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700">
            Review
          </button>
        </div>
      </div>
    </div>
  );
}
