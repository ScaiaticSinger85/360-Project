import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Users, DollarSign, X, Filter, Loader2 } from 'lucide-react';

// Types for our data
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  organizer: string;
  price: number;
  capacity: number;
  createdAt?: string;
}

interface SearchResponse {
  results: Event[];
  count: number;
  searchTerm: string;
}

interface FetchState {
  loading: boolean;
  error: string | null;
  data: Event[];
  responseMessage: string;
}

export function EventSearch() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Fetch state
  const [fetchState, setFetchState] = useState<FetchState>({
    loading: false,
    error: null,
    data: [],
    responseMessage: ''
  });

  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Main fetch function for searching
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setFetchState({
        loading: false,
        error: null,
        data: [],
        responseMessage: ''
      });
      setIsSubmitted(false);
      return;
    }

    setFetchState(prev => ({ ...prev, loading: true, error: null, responseMessage: '' }));

    try {
      // Make the fetch request to the server
      const response = await fetch(`http://localhost:5000/api/events/search?term=${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data: SearchResponse = await response.json();
      
      // Update state with results
      setFetchState({
        loading: false,
        error: null,
        data: data.results,
        responseMessage: `Found ${data.count} event${data.count !== 1 ? 's' : ''} matching "${data.searchTerm}"`
      });
      
      setIsSubmitted(true);
      
    } catch (error) {
      // Handle errors
      console.error('Search error:', error);
      setFetchState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to search events',
        data: [],
        responseMessage: 'Error searching events. Please try again.'
      });
      setIsSubmitted(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(searchTerm);
    clearSearch(); // Clear search box after submission
  };

  // Optional: Add debounced search for real-time searching
  const handleDebouncedSearch = (term: string) => {
    setSearchTerm(term);
    // You could add debouncing here if you want real-time search
    // But for lab requirements, we'll keep the explicit search button
  };

  // Format price display
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  // Format date display
  const formatDate = (date: string, time: string) => {
    return `${date} at ${time}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Events</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, category, location, or description..."
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={fetchState.loading}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={fetchState.loading || !searchTerm.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {fetchState.loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="size-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {/* Response Message */}
        {fetchState.responseMessage && (
          <div className={`p-4 rounded-lg mb-6 ${
            fetchState.error ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            <p className="font-semibold">{fetchState.responseMessage}</p>
          </div>
        )}

        {/* Error Display */}
        {fetchState.error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
            <p className="font-semibold">Error: {fetchState.error}</p>
            <p className="text-sm mt-2">Please make sure the server is running on http://localhost:5000</p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {isSubmitted && (
        <div>
          {fetchState.loading ? (
            // Loading state
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Loader2 className="size-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching for events...</p>
            </div>
          ) : fetchState.data.length === 0 ? (
            // No results state
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Search className="size-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search term or browse all events
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Example searches:</p>
                <div className="flex gap-2 justify-center mt-2">
                  <button
                    onClick={() => {
                      setSearchTerm('music');
                      performSearch('music');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    music
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('business');
                      performSearch('business');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    business
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('free');
                      performSearch('free');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    free
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Results state
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Search Results ({fetchState.data.length})
                </h3>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setIsSubmitted(false);
                    setFetchState(prev => ({ ...prev, data: [], responseMessage: '' }));
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear Results
                </button>
              </div>
              
              {fetchState.data.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-600">by {event.organizer}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {event.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="size-4 text-blue-600" />
                      <span>{formatDate(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="size-4 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="size-4 text-blue-600" />
                      <span>Capacity: {event.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="size-4 text-blue-600" />
                      <span>{formatPrice(event.price)}</span>
                    </div>
                  </div>
                  
                  {event.createdAt && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Added: {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial state message */}
      {!isSubmitted && !fetchState.loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="size-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Searching</h3>
          <p className="text-gray-500">
            Enter a search term above to find events
          </p>
        </div>
      )}
    </div>
  );
}