import { UserType, PageType } from '../App';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface WireframeNavProps {
  currentPage: PageType;
  userType: UserType;
  onPageChange: (page: PageType) => void;
  onUserTypeChange: (type: UserType) => void;
}

export function WireframeNav({ currentPage, userType, onPageChange, onUserTypeChange }: WireframeNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicPages = [
    { id: 'navigation-flow' as PageType, label: 'Navigation Flow' },
    { id: 'home' as PageType, label: 'Home Page' },
    { id: 'event-browse' as PageType, label: 'Browse Events' },
    { id: 'event-details' as PageType, label: 'Event Details' },
    { id: 'sign-in' as PageType, label: 'Sign In' },
    { id: 'sign-up' as PageType, label: 'Sign Up' },
  ];

  const userPages = [
    { id: 'create-event' as PageType, label: 'Create Event' },
    { id: 'my-events' as PageType, label: 'My Events' },
    { id: 'edit-event' as PageType, label: 'Edit Event' },
    { id: 'my-rsvps' as PageType, label: 'My RSVPs' },
    { id: 'user-profile' as PageType, label: 'User Profile' },
  ];

  const adminPages = [
    { id: 'admin-dashboard' as PageType, label: 'Admin Dashboard' },
    { id: 'user-management' as PageType, label: 'User Management' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              Kelowna Events - Wireframes
            </h1>
            
            {/* User Type Selector */}
            <div className="hidden md:flex items-center gap-2 ml-8">
              <span className="text-sm text-gray-600">View as:</span>
              <select
                value={userType}
                onChange={(e) => onUserTypeChange(e.target.value as UserType)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unregistered">Unregistered User</option>
                <option value="registered">Registered User</option>
                <option value="admin">Admin User</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              {publicPages.slice(0, 1).map((page) => (
                <button
                  key={page.id}
                  onClick={() => onPageChange(page.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View as:
              </label>
              <select
                value={userType}
                onChange={(e) => onUserTypeChange(e.target.value as UserType)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="unregistered">Unregistered User</option>
                <option value="registered">Registered User</option>
                <option value="admin">Admin User</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2">NAVIGATION</div>
              {publicPages.slice(0, 1).map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onPageChange(page.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    currentPage === page.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page.label}
                </button>
              ))}
              
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 mt-4">PUBLIC PAGES</div>
              {publicPages.slice(1).map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onPageChange(page.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    currentPage === page.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page.label}
                </button>
              ))}

              {(userType === 'registered' || userType === 'admin') && (
                <>
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2 mt-4">USER PAGES</div>
                  {userPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        onPageChange(page.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        currentPage === page.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page.label}
                    </button>
                  ))}
                </>
              )}

              {userType === 'admin' && (
                <>
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2 mt-4">ADMIN PAGES</div>
                  {adminPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => {
                        onPageChange(page.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        currentPage === page.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
