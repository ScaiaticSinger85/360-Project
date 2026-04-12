import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. 
          The page may have been moved or deleted.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
