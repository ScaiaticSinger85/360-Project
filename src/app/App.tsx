import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useInitializeData } from './utils/initializeData';

export default function App() {
  useInitializeData();

  return <RouterProvider router={router} />;
}