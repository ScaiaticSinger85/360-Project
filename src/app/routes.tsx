import { createBrowserRouter } from 'react-router-dom';
import Root from './pages/Root';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EventBrowse from './pages/EventBrowse';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import MyRSVPs from './pages/MyRSVPs';
import MyComments from './pages/MyComments';
import AdminComments from './pages/AdminComments';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'sign-in', Component: SignIn },
      { path: 'sign-up', Component: SignUp },
      { path: 'events', Component: EventBrowse },
      { path: 'events/:id', Component: EventDetails },
      { path: 'create-event', Component: CreateEvent },
      { path: 'edit-event/:id', Component: EditEvent },
      { path: 'my-events', Component: MyEvents },
      { path: 'my-rsvps', Component: MyRSVPs },
      { path: 'my-comments', Component: MyComments },
      { path: 'admin/comments', Component: AdminComments },
      { path: 'profile', Component: UserProfile },
      { path: 'admin', Component: AdminDashboard },
      { path: 'admin/users', Component: UserManagement },
      { path: '*', Component: NotFound },
    ],
  },
]);
