import { Calendar, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Calendar className="size-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Kelowna Events</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors">
              Events
            </a>
            <a href="#categories" className="text-gray-700 hover:text-blue-600 transition-colors">
              Categories
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a
                href="#events"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </a>
              <a
                href="#categories"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Button variant="ghost" className="w-full">Sign In</Button>
                <Button className="w-full">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
