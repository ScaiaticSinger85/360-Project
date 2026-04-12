import { Link } from 'react-router';
import { Calendar, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Calendar className="size-8 text-blue-500" />
              <span className="font-bold text-xl text-white">Kelowna Events</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Connecting the Kelowna community through amazing local events and experiences.
            </p>
            <div className="flex gap-3">
              <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Facebook className="size-5" />
              </span>
              <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Twitter className="size-5" />
              </span>
              <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Instagram className="size-5" />
              </span>
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="font-semibold text-white mb-4">Events</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="hover:text-blue-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="hover:text-blue-400 transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="hover:text-blue-400 transition-colors">
                  My Events
                </Link>
              </li>
              <li>
                <Link to="/my-rsvps" className="hover:text-blue-400 transition-colors">
                  My RSVPs
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/sign-in" className="hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-blue-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">A community event platform</span>
              </li>
              <li>
                <span className="text-gray-400">Built for Kelowna, BC</span>
              </li>
              <li>
                <span className="text-gray-400">COSC 360 Project</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p>© 2026 Kelowna Events. All rights reserved.</p>
          <p>Made with ❤️ for the Kelowna community</p>
        </div>
      </div>
    </footer>
  );
}
