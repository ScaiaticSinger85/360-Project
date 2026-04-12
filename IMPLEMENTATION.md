# Kelowna Events — Implementation Description

## System Overview

Kelowna Events is a full-stack web application for discovering, creating, and managing community events in Kelowna, BC. The system consists of a React/TypeScript single-page application (SPA) served via Vite, a Node.js/Express REST API backend, and a MongoDB Atlas cloud database. The two services communicate over HTTP and are containerized with Docker for deployment.

---

## Architecture

```
Browser (React SPA)
       │
       │  HTTP / REST API (/api/...)
       ▼
Express Server (Node.js, port 4000)
       │
       │  MongoDB Driver
       ▼
MongoDB Atlas (cloud database)
```

In development, Vite proxies all `/api` requests to `localhost:4000` so the frontend and backend can run on different ports without CORS issues. In production (Docker), nginx routes `/api` requests to the Express container and serves the compiled React bundle for all other paths.

---

## File Structure

### Frontend (`src/app/`)

| Path | Description |
|------|-------------|
| `pages/Home.tsx` | Landing page with hero image, category tiles, upcoming events, and How It Works section |
| `pages/EventBrowse.tsx` | Searchable, filterable, paginated event listing with skeleton loading |
| `pages/EventDetails.tsx` | Full event view with RSVP, reviews, comments, and organizer controls |
| `pages/CreateEvent.tsx` | Multi-section event creation form with live image preview |
| `pages/EditEvent.tsx` | Pre-populated form for editing an existing event |
| `pages/MyEvents.tsx` | Dashboard of events created by the logged-in user |
| `pages/MyRSVPs.tsx` | List of events the user has RSVP'd to |
| `pages/UserProfile.tsx` | Profile editing page with stats banner and avatar upload |
| `pages/AdminDashboard.tsx` | Admin view for managing all events |
| `pages/UserManagement.tsx` | Admin view for managing user accounts |
| `pages/SignIn.tsx` | Login form with split-layout design |
| `pages/SignUp.tsx` | Registration form with split-layout design |
| `pages/NotFound.tsx` | Custom 404 page |
| `pages/Root.tsx` | Root layout wrapping all pages (Navigation, Footer, Toaster) |
| `components/Navigation.tsx` | Sticky top nav with avatar, active-link highlighting, mobile hamburger menu |
| `components/Footer.tsx` | Site footer with navigation links |
| `contexts/AuthContext.tsx` | React context managing user authentication state and localStorage persistence |
| `contexts/DataContext.tsx` | React context managing events, RSVPs, reviews; all API calls to backend |
| `utils/categoryImages.ts` | Maps category names to Unsplash fallback images |
| `routes.tsx` | React Router v7 route definitions |

### Backend (`server/`)

| Path | Description |
|------|-------------|
| `server.js` | Express app entry point; connects to MongoDB and mounts all routers |
| `config/db.js` | MongoDB connection and `getCollections()` helper |
| `controllers/authController.js` | Signup, signin, profile update, and user RSVP lookup |
| `controllers/eventController.js` | Full CRUD for events plus RSVP toggle |
| `controllers/commentsController.js` | Get, add, and delete comments per event |
| `controllers/usersController.js` | Admin user management (list, disable/enable) |
| `routes/authRoutes.js` | `/api/auth` endpoints |
| `routes/eventRoutes.js` | `/api/events` endpoints |
| `routes/commentsRoutes.js` | `/api/events/:id/comments` endpoints |
| `routes/usersRoutes.js` | `/api/users` endpoints |
| `middleware/uploadMiddleware.js` | Multer configuration for file uploads (avatar, event images) |
| `tests/` | Jest + Supertest server-side test suite |

---

## How the System Works

### Authentication
Users sign up or sign in via the `/api/auth` endpoints. Passwords are hashed using `bcryptjs` before storage. On sign-in, the server returns the user object (without the password). The frontend stores this in `localStorage` via `AuthContext` and uses it to conditionally show UI elements and protect routes.

### Events
Events are stored in MongoDB with all associated fields (title, description, date, location, capacity, etc.). The `DataContext` fetches all events on app load and maintains them in React state. Individual components filter and sort client-side. Creating or updating an event calls the REST API which writes to MongoDB, then the local state is updated to avoid a full refetch.

### RSVPs
When a user RSVPs, an optimistic update immediately reflects the change in the UI (attendee count, button state). A `POST /api/events/:id/rsvp` call then syncs with the server, which updates both the event's `rsvpUserIds` array and the user's `rsvpEventIds` array. The server response corrects the count if the optimistic value was off.

### Comments
Comments are stored in a separate MongoDB `comments` collection linked by `eventId`. They are fetched when an event detail page loads. Posting a comment calls `POST /api/events/:id/comments` and the response is prepended to the local list without a page reload. Profile photo updates propagate to all existing comments via a `updateMany` on the comments collection.

### Profile Photos
Photos are uploaded via a `multipart/form-data` request, processed by Multer, and stored as base64 data strings in MongoDB. The base64 string is sent back to the client and stored in context/localStorage as the `avatarUrl`.

### Security
- Passwords are hashed with bcrypt (salt rounds: 10)
- All user-provided text on the server is passed through a `sanitize()` function that strips `<` and `>` to prevent XSS
- All MongoDB ObjectId parameters are validated with `ObjectId.isValid()` before use
- Route access is gated client-side by user role (`unregistered`, `user`, `admin`)
- Disabled accounts are rejected at sign-in with a 403 response

---

## Testing

**Server-side (Jest + Supertest):** 26 tests across 3 test files covering auth endpoints (signup, signin, validation, disabled accounts), event endpoints (CRUD, RSVP, capacity enforcement), and comment endpoints (get, post, delete, XSS sanitization). MongoDB is mocked so tests run without a real database.

**Client-side (Vitest):** 33 tests across 2 test files covering the `getCategoryImage` utility function and all client-side form validation logic (title, description, capacity, image URL, email, password).

Run server tests: `cd server && npm test`
Run client tests: `npm test`

---

## Known Limitations

1. **No real-time updates:** Comments and RSVP counts do not push updates to other connected users. Another user must reload the page to see changes made by others.
2. **No JWT / server sessions:** Authentication state is stored in `localStorage`. There is no token expiry or server-side session invalidation.
3. **No email verification:** Users can sign up with any email address without verification.
4. **Image storage as base64:** Storing images as base64 strings in MongoDB increases document size. A production system would use object storage (S3, Cloudinary).
5. **No rate limiting:** The API has no rate limiting, making it vulnerable to brute-force attacks in a production environment.
6. **Reviews are localStorage-only:** Event reviews (star ratings) are stored in the browser's `localStorage`, not in MongoDB. They are not shared between users or devices.
