import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const featuredEvents = [
  {
    id: 1,
    title: 'Summer Music Festival 2026',
    date: 'June 15, 2026',
    time: '6:00 PM',
    location: 'Waterfront Park',
    image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwbXVzaWMlMjBmZXN0aXZhbCUyMGNvbmNlcnR8ZW58MXx8fHwxNzcwNjE2MTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Music',
    attendees: 250,
  },
  {
    id: 2,
    title: 'Tech & Innovation Conference',
    date: 'March 22, 2026',
    time: '9:00 AM',
    location: 'Kelowna Convention Center',
    image: 'https://images.unsplash.com/photo-1769798643237-8642a3fbe5bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBjb25mZXJlbmNlfGVufDF8fHx8MTc3MDU2MjEwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Business',
    attendees: 180,
  },
  {
    id: 3,
    title: 'Community Art Exhibition',
    date: 'February 28, 2026',
    time: '2:00 PM',
    location: 'Downtown Gallery',
    image: 'https://images.unsplash.com/photo-1768884918877-5851853d4872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbiUyMGV2ZW50fGVufDF8fHx8MTc3MDYxNjE3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Arts',
    attendees: 95,
  },
];

export function FeaturedEvents() {
  return (
    <section id="events" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular and upcoming events in Kelowna
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredEvents.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-4 right-4 bg-blue-600">
                  {event.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-blue-600" />
                    <span className="text-sm">
                      {event.date} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-blue-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-blue-600" />
                    <span className="text-sm">{event.attendees} attending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
}
