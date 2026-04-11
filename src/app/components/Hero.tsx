import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Hero() {
  return (
    <section className="relative pt-16 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578945761766-a4bc916e0dc7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2Vsb3duYXxlbnwwfHwwfHx8MA%3D%3D"
          alt="Kelowna scenic view"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80';
          }}
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Discover Amazing Events in Kelowna
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Connect with your community through local events, workshops, concerts, and more. 
            Create, discover, and RSVP to events all in one place.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for events..."
                className="pl-12 h-14 bg-white text-gray-900 border-0"
              />
            </div>
            <Button size="lg" className="h-14 px-8 bg-white text-blue-600 hover:bg-gray-100">
              Search
            </Button>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors backdrop-blur-sm">
              Music & Concerts
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors backdrop-blur-sm">
              Workshops
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors backdrop-blur-sm">
              Sports & Fitness
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors backdrop-blur-sm">
              Arts & Culture
            </button>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative">
        <svg
          className="w-full h-12 sm:h-16 fill-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
}
