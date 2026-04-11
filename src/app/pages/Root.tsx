import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
