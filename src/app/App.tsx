import { useMemo, useState } from "react";
import { WireframeNav } from "./components/WireframeNav";
import { WireframeViewer } from "./components/WireframeViewer";

export type UserType = "unregistered" | "registered" | "admin";

export type PageType =
  | "home"
  | "event-browse"
  | "event-details"
  | "sign-in"
  | "sign-up"
  | "create-event"
  | "my-events"
  | "my-rsvps"
  | "user-profile"
  | "edit-event"
  | "admin-dashboard"
  | "user-management";

const PUBLIC_PAGES: PageType[] = [
  "home",
  "event-browse",
  "event-details",
  "sign-in",
  "sign-up",
];

const REGISTERED_PAGES: PageType[] = [
  "create-event",
  "my-events",
  "my-rsvps",
  "user-profile",
  "edit-event",
];

const ADMIN_PAGES: PageType[] = ["admin-dashboard", "user-management"];

function getAllowedPages(userType: UserType): PageType[] {
  if (userType === "admin") return [...PUBLIC_PAGES, ...REGISTERED_PAGES, ...ADMIN_PAGES];
  if (userType === "registered") return [...PUBLIC_PAGES, ...REGISTERED_PAGES];
  return [...PUBLIC_PAGES];
}

function getDefaultPage(userType: UserType): PageType {
  return "home";
}

export default function App() {
  const [userType, setUserType] = useState<UserType>("unregistered");
  const allowedPages = useMemo(() => getAllowedPages(userType), [userType]);
  const [currentPage, setCurrentPage] = useState<PageType>(getDefaultPage("unregistered"));

  const setPage = (next: PageType) => {
    if (allowedPages.includes(next)) setCurrentPage(next);
    else setCurrentPage(getDefaultPage(userType));
  };

  const setRole = (next: UserType) => {
    setUserType(next);
    const nextAllowed = getAllowedPages(next);
    setCurrentPage((prev) => (nextAllowed.includes(prev) ? prev : getDefaultPage(next)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WireframeNav
        currentPage={currentPage}
        userType={userType}
        onPageChange={setPage}
        onUserTypeChange={setRole}
      />
      <main className="pt-20">
        <WireframeViewer page={currentPage} userType={userType} onNavigate={setPage} />
      </main>
    </div>
  );
}