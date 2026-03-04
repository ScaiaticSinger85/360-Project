import { useState } from 'react';
import { WireframeNav } from './components/WireframeNav';
import { WireframeViewer } from './components/WireframeViewer';
import { NavigationFlow } from './components/NavigationFlow';

export type UserType = 'unregistered' | 'registered' | 'admin';

export type PageType = 
  // Public pages
  | 'home'
  | 'event-browse'
  | 'event-details'
  | 'sign-in'
  | 'sign-up'
  // Registered user pages
  | 'create-event'
  | 'my-events'
  | 'my-rsvps'
  | 'user-profile'
  | 'edit-event'
  // Admin pages
  | 'admin-dashboard'
  | 'user-management'
  // Navigation flow
  | 'navigation-flow';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('navigation-flow');
  const [userType, setUserType] = useState<UserType>('unregistered');

  return (
    <div className="min-h-screen bg-gray-50">
      <WireframeNav 
        currentPage={currentPage}
        userType={userType}
        onPageChange={setCurrentPage}
        onUserTypeChange={setUserType}
      />
      
      <main className="pt-20">
        {currentPage === 'navigation-flow' ? (
          <NavigationFlow onNavigate={setCurrentPage} />
        ) : (
          <WireframeViewer 
            page={currentPage}
            userType={userType}
            onNavigate={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
