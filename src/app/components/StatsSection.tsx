const stats = [
  {
    value: '500+',
    label: 'Events Hosted',
  },
  {
    value: '10K+',
    label: 'Community Members',
  },
  {
    value: '50+',
    label: 'Event Organizers',
  },
  {
    value: '4.8/5',
    label: 'Average Rating',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Join Kelowna's Largest Event Community
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Trusted by thousands of locals to discover and organize amazing events
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 text-sm sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
            Start Creating Events
          </button>
        </div>
      </div>
    </section>
  );
}
