import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useData } from '../contexts/DataContext';
import { getCategoryImage } from '../utils/categoryImages';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, MapPin, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, addMonths, startOfDay } from 'date-fns';

const CATEGORIES = [
  'All Categories',
  'Music',
  'Food & Drink',
  'Sports & Fitness',
  'Arts & Culture',
  'Technology',
  'Community',
  'Networking',
  'Business',
  'Art',
  'Sports',
  'Health',
  'Party',
  'Education',
  'Social',
  'Tech',
];

const DATE_FILTERS = [
  { label: 'Any time', value: 'all' },
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'Next 3 months', value: '3months' },
];

const SORT_OPTIONS = [
  { label: 'Soonest first', value: 'date-asc' },
  { label: 'Latest first', value: 'date-desc' },
  { label: 'Most popular', value: 'popular' },
  { label: 'Most spots left', value: 'spots' },
];

const EVENTS_PER_PAGE = 9;

type EventType = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  capacity: number;
  imageUrl: string;
  organizer: string;
  organizerId: string;
  isPublic: boolean;
  attendees: number;
};

function EventCardSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="aspect-video w-full rounded-t-lg rounded-b-none" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-9 w-full mt-2" />
      </CardContent>
    </Card>
  );
}

export default function EventBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, isLoading, fetchEvents } = useData();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All Categories'
  );
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOption, setSortOption] = useState('date-asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, dateFilter, sortOption]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const filteredEvents = useMemo(() => {
    let results = [...(events || [])] as EventType[];
    const now = startOfDay(new Date());

    if (selectedCategory !== 'All Categories') {
      results = results.filter(
        (event) => (event.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((event) =>
        (event.title || '').toLowerCase().includes(query) ||
        (event.description || '').toLowerCase().includes(query) ||
        (event.location || '').toLowerCase().includes(query) ||
        (event.address || '').toLowerCase().includes(query) ||
        (event.organizer || '').toLowerCase().includes(query) ||
        (event.category || '').toLowerCase().includes(query)
      );
    }

    if (dateFilter !== 'all') {
      const cutoff =
        dateFilter === 'week' ? addDays(now, 7) :
        dateFilter === 'month' ? addMonths(now, 1) :
        addMonths(now, 3);
      results = results.filter((event) => {
        const d = new Date(event.date);
        return d >= now && d <= cutoff;
      });
    }

    results.sort((a, b) => {
      if (sortOption === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === 'popular') return b.attendees - a.attendees;
      if (sortOption === 'spots') return (b.capacity - b.attendees) - (a.capacity - a.attendees);
      return 0;
    });

    return results;
  }, [events, searchQuery, selectedCategory, dateFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setDateFilter('all');
    setSortOption('date-asc');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All Categories' || dateFilter !== 'all' || sortOption !== 'date-asc';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white">
          <h1 className="text-4xl font-bold mb-2">Browse Events</h1>
          <p className="text-lg text-blue-100">
            Discover amazing events happening in Kelowna
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by title, description, category, organizer, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="w-full md:w-52">
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
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FILTERS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button type="button" variant="outline" onClick={handleClearSearch}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          {isLoading ? (
            <p className="text-gray-600">Loading events...</p>
          ) : (
            <p className="text-gray-600">
              {filteredEvents.length === 0 ? (
                <span className="text-red-600 font-semibold">No events found matching your criteria</span>
              ) : (
                <span>
                  Showing{' '}
                  <span className="font-semibold">
                    {(currentPage - 1) * EVENTS_PER_PAGE + 1}–{Math.min(currentPage * EVENTS_PER_PAGE, filteredEvents.length)}
                  </span>{' '}
                  of <span className="font-semibold">{filteredEvents.length}</span>{' '}
                  {filteredEvents.length === 1 ? 'event' : 'events'}
                </span>
              )}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-video overflow-hidden bg-gray-100 relative group">
                      <img
                        src={event.imageUrl || getCategoryImage(event.category)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.onerror = null;
                          img.src = getCategoryImage(event.category);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                          View Details →
                        </span>
                      </div>
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

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
                          <span>{event.attendees} / {event.capacity} attending</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${event.attendees >= event.capacity ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
                          />
                        </div>

                        <div className="pt-1 text-sm">
                          <span className="font-medium text-gray-700">Organizer: </span>
                          <span className="text-gray-600">{event.organizer}</span>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-9"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
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
