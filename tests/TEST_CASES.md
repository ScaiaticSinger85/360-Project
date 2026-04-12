# Test Cases

1. Sign up with name, email, password, and profile image. Confirm the new user is logged in immediately.
2. Sign in with the admin credentials from `server/.env` and confirm the Admin and Users pages appear in the navigation.
3. Create an event with either an uploaded image or an image URL, then verify the image renders on the home page and event details page.
4. Open the event in a second browser, add comments, like or dislike the event, and verify counts update without a manual page refresh.
5. From the admin user, open `Admin Dashboard` and `User Management`, confirm all Mongo users appear, then disable and re-enable another account.
6. From the admin user, search users by name, email, and post content, and confirm matching users remain visible.
7. Visit `My Comments` as a regular user and confirm the full comment history appears.
