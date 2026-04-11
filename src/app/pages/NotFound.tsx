import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, Calendar, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8 relative inline-block">
          <div className="text-[10rem] font-black text-blue-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-blue-600 opacity-80" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Looks like this event got cancelled. The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Link to="/events">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="h-5 w-5" />
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
