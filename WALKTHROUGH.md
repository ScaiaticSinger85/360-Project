# Kelowna Events — User Walkthrough Guide

## Overview

Kelowna Events is a community event platform where users can browse, create, and RSVP to local events in Kelowna, BC. This guide walks a tester through all major features of the site.

---

## Getting Started

### Running the Site

**Option 1 — Local Development (recommended for testing)**

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
2. In a separate terminal, start the frontend:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`

**Option 2 — Docker**

```bash
docker-compose up --build
```
Then open `http://localhost:3000`

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kelownaevents.com | admin123 |
| Regular User | testuser@kelownaevents.com | password123 |

> If these accounts don't exist, create them via the Sign Up page. To make an account an admin, update the `role` field to `"admin"` in MongoDB.

---

## Walkthrough Steps

### 1. Browse Events (No Login Required)

1. Navigate to the homepage at `/`
2. Scroll down to see upcoming events and category tiles
3. Click **Browse Events** in the navigation bar
4. You will see a grid of events with images, dates, and attendance bars
5. **Test search:** Type "Music" in the search bar — results filter in real time
6. **Test category filter:** Select "Food & Drink" from the category dropdown
7. **Test date filter:** Select "This week" from the date range dropdown
8. **Test sort:** Change the sort to "Most popular" — events reorder by attendees
9. **Test pagination:** If there are more than 9 events, Previous/Next buttons appear at the bottom
10. Click on any event card to view its details

### 2. Event Details Page (No Login Required)

1. From Browse Events, click any event card
2. You will see:
   - A hero image with event title and organizer overlaid
   - **Share** button (top right) — click it to copy the link to your clipboard. A toast notification confirms.
   - Event details sidebar (date, time, location, capacity progress bar)
   - About This Event section
   - Reviews section
   - Discussion/Comments section
3. Notice the capacity bar — red when full, green when spots remain
4. The RSVP card prompts you to sign in if you are not logged in

### 3. Sign Up

1. Click **Sign Up** in the navigation bar
2. Fill in name, email, password, and confirm password
3. All fields are required; validation errors appear inline if something is wrong
4. On success, you are signed in and redirected to the home page

### 4. Sign In

1. Click **Sign In** in the navigation bar
2. Enter email and password
3. On success, the nav bar updates to show your name and profile avatar
4. Your avatar initials appear if no profile photo is set

### 5. RSVP to an Event (Requires Login)

1. Navigate to any event's detail page
2. The right sidebar shows a **"Reserve Your Spot"** card
3. Click **RSVP** — the button text changes to "Cancel RSVP", the sidebar turns green, and the attendee count increases immediately (no page reload)
4. Click **Cancel RSVP** to remove your RSVP — the count decreases
5. Navigate to **My RSVPs** in the navigation bar to see all events you've RSVP'd to

### 6. Post a Comment (Requires Login + RSVP)

1. On any event detail page, scroll to the **Discussion** section
2. Type a message in the text area and click **Post Comment**
3. Your comment appears immediately at the top without a page reload
4. Your profile avatar appears next to your comment
5. You (or an admin) can delete comments using the trash icon

### 7. Leave a Review (Requires Login + RSVP)

1. On an event detail page, scroll to the **Reviews** section
2. If you have RSVP'd, a review form appears below existing reviews
3. Select a star rating (1–5) and write a review
4. Click **Submit Review** — your review appears immediately

### 8. Create an Event (Requires Login)

1. Click **Create Event** in the navigation bar
2. The page is divided into sections: Basic Information, Date & Time, Location, Event Image, Additional Details
3. Fill in all required fields (marked with *)
4. In the **Event Image** section, paste an image URL — a live preview appears below
5. Toggle the **Public Event** switch to make the event private or public
6. Click **Create Event** — a success toast appears and you are redirected to My Events

### 9. Manage Your Events (Requires Login)

1. Click **My Events** in the navigation bar
2. See a list of events you have created
3. Click **Edit** to modify an event, or **Delete** to remove it
4. On an event's detail page, as the organizer you see a **Manage Event** card with Edit and Delete buttons

### 10. Profile Page (Requires Login)

1. Click your name in the navigation bar
2. The profile banner shows stats: events created, RSVPs, and account type
3. Click **Edit Profile** to update your name, bio, or profile photo
4. Upload a photo from your computer — it appears immediately in the preview
5. Click **Save Changes** — a success toast confirms the update
6. Your new avatar appears in the navigation bar and on any comments you've made

### 11. Admin Dashboard (Requires Admin Role)

1. Sign in as the admin account
2. The navigation bar shows **Admin** and **Users** links
3. Navigate to `/admin` to manage all events (view, delete any event)
4. Navigate to `/admin/users` to view all registered users and disable accounts

### 12. Mobile Navigation

1. Resize the browser window to a narrow width (or use DevTools mobile mode)
2. The navigation links collapse and a hamburger menu (☰) appears top right
3. Click the hamburger to open a slide-out drawer with all navigation links
4. Your avatar and name appear at the top of the drawer

---

## Unique Features

- **Live image preview** when creating events — paste a URL and see the image immediately
- **Capacity progress bar** on every event card and detail page — turns red when full
- **Avatar propagation** — updating your profile photo retroactively updates it on all existing comments
- **Skeleton loading cards** — animated placeholders show while events load from the server
- **Share button** — copies the event URL to clipboard with a toast confirmation
- **Async RSVP** — the attendee count updates immediately, then syncs with the server in the background

---

## Known Issues / Limitations

- Comments do not auto-refresh in real time for other users — a page reload is needed to see comments from other users
- Auth is stored in `localStorage` (no server-side session expiry)
- Image URLs must be publicly accessible (base64 upload is only available for profile photos)
