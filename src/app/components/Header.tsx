import { useState } from "react";
import { Calendar, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

type UserType = "unregistered" | "registered" | "admin";

type HeaderProps = {
  userType?: UserType;
  onNavigate?: (page: string) => void;
};

export function Header({ userType = "unregistered", onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const close = () => setMobileMenuOpen(false);
  const go = (page: string) => {
    if (onNavigate) onNavigate(page);
    close();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            type="button"
            onClick={() => go("home")}
            className="flex items-center gap-2"
          >
            <Calendar className="size-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Kelowna Events</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => go("event-browse")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Browse Events
            </button>
            {userType !== "unregistered" && (
              <>
                <button
                  type="button"
                  onClick={() => go("my-events")}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  My Events
                </button>
                <button
                  type="button"
                  onClick={() => go("my-rsvps")}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  My RSVPs
                </button>
              </>
            )}
            {userType === "admin" && (
              <button
                type="button"
                onClick={() => go("admin-dashboard")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin
              </button>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {userType === "unregistered" ? (
              <>
                <Button variant="ghost" onClick={() => go("sign-in")}>
                  Sign In
                </Button>
                <Button onClick={() => go("sign-up")}>Get Started</Button>
              </>
            ) : (
              <Button onClick={() => go("create-event")}>Create Event</Button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => go("event-browse")}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
              >
                Browse Events
              </button>

              {userType !== "unregistered" && (
                <>
                  <button
                    type="button"
                    onClick={() => go("my-events")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    My Events
                  </button>
                  <button
                    type="button"
                    onClick={() => go("my-rsvps")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    My RSVPs
                  </button>
                </>
              )}

              {userType === "admin" && (
                <button
                  type="button"
                  onClick={() => go("admin-dashboard")}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Admin
                </button>
              )}

              <div className="flex flex-col gap-2 px-4 pt-2">
                {userType === "unregistered" ? (
                  <>
                    <Button variant="ghost" className="w-full" onClick={() => go("sign-in")}>
                      Sign In
                    </Button>
                    <Button className="w-full" onClick={() => go("sign-up")}>
                      Get Started
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" onClick={() => go("create-event")}>
                    Create Event
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}