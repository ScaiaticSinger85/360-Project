# Kelowna Events — Feature Summary

## Core Features Implemented

### User Authentication
- User registration (sign up) with name, email, and password
- Password hashing with bcrypt before storage in MongoDB
- User login (sign in) with email and password verification
- Disabled account detection — blocked accounts cannot sign in
- User roles: `user` and `admin`
- Auth state persisted in `localStorage`, reflected across all pages

### Event Management
- Browse all public events in a responsive card grid
- Search events by title, description, category, organizer, or location
- Filter by category (Music, Food & Drink, Sports & Fitness, Arts & Culture, Technology, Community, etc.)
- Filter by date range (any time, this week, this month, next 3 months)
- Sort events by: soonest first, latest first, most popular, most spots remaining
- Paginated results (9 events per page) with Previous/Next controls
- Create new events with a multi-section form and live image preview
- Edit existing events (organizer only)
- Delete events (organizer or admin only)
- Category-based fallback images when no custom image is provided
- Capacity progress bar on every event card and detail page

### RSVP System
- Authenticated users can RSVP to any event with available capacity
- RSVP updates attendee count immediately (optimistic update) then syncs with server
- Events at capacity show as full and block new RSVPs
- "My RSVPs" page lists all events the user has RSVP'd to
- RSVP state stored in both the event document (`rsvpUserIds`) and user document (`rsvpEventIds`)

### Comments / Discussion
- Authenticated users can post comments on any event
- Comments are stored in MongoDB and fetched per event
- Comments display with user avatar, name, and timestamp
- Users can delete their own comments; admins can delete any comment
- Comment input form with async submission (no page reload)

### Reviews
- Users who have RSVP'd can leave a star rating (1–5) and written review
- Reviews display below event description with star icons and author name
- Review submission is immediate (no page reload)

### User Profiles
- Profile page with editable name, bio, and profile photo
- Profile banner shows: events created count, RSVPs count, and account type
- Profile photo upload (stored as base64 in MongoDB)
- Updating profile photo retroactively updates avatar on all existing comments
- Avatar and name displayed in navigation bar when signed in

### Admin Features
- Admin dashboard to view and manage all events
- User management page to view all registered users
- Ability to disable/enable user accounts
- Admin nav links only visible to users with `admin` role

### UI / UX
- Gradient page banners consistent across all pages
- Skeleton loading cards during event fetch
- Toast notifications for all user actions (RSVP, comment, event creation, profile update)
- Mobile-responsive hamburger menu (slide-out drawer)
- Share button on event detail page (copies URL to clipboard)
- Live image preview in Create Event form
- Custom 404 page
- Footer with navigation links on all pages
- Hover overlay on event cards ("View Details →")

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI) |
| Routing | React Router v7 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (cloud) |
| Auth | bcryptjs (password hashing) |
| File Uploads | Multer (base64 storage) |
| Deployment | Docker + nginx |
| Server Tests | Jest + Supertest (26 tests) |
| Client Tests | Vitest (33 tests) |

## Testing Summary

- **59 total tests** — all passing
- **Server-side tests (26):** auth signup/signin validation, event CRUD, RSVP capacity enforcement, comment sanitization (XSS prevention), delete operations
- **Client-side tests (33):** utility function coverage (`getCategoryImage`), form validation logic for all input fields (title, description, capacity, image URL, email, password)
