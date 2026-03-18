import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../types';

const CATEGORIES = [
  'All Categories',
  'Music',
  'Food & Drink',
  'Sports & Fitness',
  'Arts & Culture',
  'Technology',
  'Community',
];

export default function EventBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchEvents } = useData();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All Categories'
  );
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    performSearch();
  }, [selectedCategory]);

  const performSearch = () => {
    const category = selectedCategory === 'All Categories' ? undefined : selectedCategory;
    const results = searchEvents(searchQuery, category);
    setFilteredEvents(results);

    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category) params.set('category', category);
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSearchParams({});
    setFilteredEvents(searchEvents('', undefined));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Events</h1>
          <p className="text-lg text-gray-600">
            Discover amazing events happening in Kelowna
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search events by title, description, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Search</Button>
                  {(searchQuery || selectedCategory !== 'All Categories') && (
                    <Button type="button" variant="outline" onClick={handleClearSearch}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredEvents.length === 0 ? (
              <span className="text-red-600 font-semibold">No events found matching your criteria</span>
            ) : (
              <span>
                Showing <span className="font-semibold">{filteredEvents.length}</span>{' '}
                {filteredEvents.length === 1 ? 'event' : 'events'}
                {searchQuery && (
                  <span> for "<span className="font-semibold">{searchQuery}</span>"</span>
                )}
              </span>
            )}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                      <span className="font-semibold">{event.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {event.attendees} / {event.capacity} attending
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all events
            </p>
            <Button onClick={handleClearSearch}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
