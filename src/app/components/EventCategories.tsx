import { Music, Briefcase, Palette, Dumbbell, Users, Utensils } from 'lucide-react';

const categories = [
  {
    icon: Music,
    name: 'Music & Concerts',
    count: 45,
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Briefcase,
    name: 'Business & Networking',
    count: 32,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    name: 'Arts & Culture',
    count: 28,
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Dumbbell,
    name: 'Sports & Fitness',
    count: 41,
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Users,
    name: 'Community',
    count: 56,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Utensils,
    name: 'Food & Drink',
    count: 38,
    color: 'from-yellow-500 to-orange-500',
  },
];

export function EventCategories() {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="size-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.count} events
                    </p>
                  </div>
                  <svg
                    className="size-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
