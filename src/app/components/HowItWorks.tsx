import { Search, Calendar, Share2, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover Events',
    description: 'Browse and search through hundreds of local events in Kelowna. Filter by category, date, and location.',
  },
  {
    icon: Calendar,
    title: 'RSVP & Save',
    description: 'Register for events that interest you. Keep track of your upcoming events all in one place.',
  },
  {
    icon: Share2,
    title: 'Create & Share',
    description: 'Organize your own events and share them with the community. Reach hundreds of local participants.',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'Share your experience and help others discover great events. Build trust in the community.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to make the most of your event experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                )}
                
                {/* Icon Circle */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 mx-auto">
                  <Icon className="size-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="font-bold text-blue-600">{index + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
