import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { Navigation } from '../components/Navigation';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Outlet />
          </main>
          <Toaster />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
