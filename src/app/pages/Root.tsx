import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Navigation } from '../components/Navigation';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main>
              <Outlet />
            </main>
            <Toaster />
          </div>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
