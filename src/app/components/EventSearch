import { useState } from 'react';
import { Search, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

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
}

interface SearchResponse {
  results: Event[];
  count: number;
  searchTerm: string;
}

export function EventSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearched(false);
      return;
    }

    setIsSearching(true);
    setSearched(true);
    setResponseMessage('');

    try {
      const response = await fetch(`http://localhost:4000/api/events/search?term=${encodeURIComponent(searchTerm)}`);
      const data: SearchResponse = await response.json();
      
      setSearchResults(data.results);
      setResponseMessage(`Found ${data.count} event${data.count !== 1 ? 's' : ''} matching "${data.searchTerm}"`);
      setSearchTerm('');
    } catch (error) {
      console.error('Search error:', error);
      setResponseMessage('Error searching events. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, category, location, or description..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {responseMessage && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
          {responseMessage}
        </div>
      )}

      {searched && (
        <div>
          {searchResults.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Search className="size-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search term or browse all events
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Search Results ({searchResults.length})
              </h3>
              {searchResults.map((event) => (
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
                      <span>{event.date} at {event.time}</span>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}