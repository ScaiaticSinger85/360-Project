import { UserType, PageType } from '../App';
import { HomePage } from './wireframes/HomePage';
import { EventBrowsePage } from './wireframes/EventBrowsePage';
import { EventDetailsPage } from './wireframes/EventDetailsPage';
import { SignInPage } from './wireframes/SignInPage';
import { SignUpPage } from './wireframes/SignUpPage';
import { CreateEventPage } from './wireframes/CreateEventPage';
import { MyEventsPage } from './wireframes/MyEventsPage';
import { EditEventPage } from './wireframes/EditEventPage';
import { MyRSVPsPage } from './wireframes/MyRSVPsPage';
import { UserProfilePage } from './wireframes/UserProfilePage';
import { AdminDashboardPage } from './wireframes/AdminDashboardPage';
import { UserManagementPage } from './wireframes/UserManagementPage';

interface WireframeViewerProps {
  page: PageType;
  userType: UserType;
  onNavigate: (page: PageType) => void;
}

export function WireframeViewer({ page, userType, onNavigate }: WireframeViewerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
            {userType === 'unregistered' ? 'Unregistered User' : 
             userType === 'registered' ? 'Registered User' : 'Admin User'}
          </span>
          <span>viewing</span>
          <span className="font-semibold text-gray-900">
            {page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Page
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Click on interactive elements within the wireframe to navigate between pages.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden">
        {page === 'home' && <HomePage onNavigate={onNavigate} userType={userType} />}
        {page === 'event-browse' && <EventBrowsePage onNavigate={onNavigate} userType={userType} />}
        {page === 'event-details' && <EventDetailsPage onNavigate={onNavigate} userType={userType} />}
        {page === 'sign-in' && <SignInPage onNavigate={onNavigate} />}
        {page === 'sign-up' && <SignUpPage onNavigate={onNavigate} />}
        {page === 'create-event' && <CreateEventPage onNavigate={onNavigate} />}
        {page === 'my-events' && <MyEventsPage onNavigate={onNavigate} />}
        {page === 'edit-event' && <EditEventPage onNavigate={onNavigate} />}
        {page === 'my-rsvps' && <MyRSVPsPage onNavigate={onNavigate} />}
        {page === 'user-profile' && <UserProfilePage onNavigate={onNavigate} />}
        {page === 'admin-dashboard' && <AdminDashboardPage onNavigate={onNavigate} />}
        {page === 'user-management' && <UserManagementPage onNavigate={onNavigate} />}
      </div>
    </div>
  );
}
