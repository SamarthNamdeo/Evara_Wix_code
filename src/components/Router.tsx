import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ChecklistPage from '@/components/pages/ChecklistPage';
import GuestListPage from '@/components/pages/GuestListPage';
import VendorsPage from '@/components/pages/VendorsPage';
import CalendarPage from '@/components/pages/CalendarPage';
import AIAssistantPage from '@/components/pages/AIAssistantPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "checklist",
        element: <ChecklistPage />,
        routeMetadata: {
          pageIdentifier: 'checklist',
        },
      },
      {
        path: "guests",
        element: <GuestListPage />,
        routeMetadata: {
          pageIdentifier: 'guests',
        },
      },
      {
        path: "vendors",
        element: <VendorsPage />,
        routeMetadata: {
          pageIdentifier: 'vendors',
        },
      },
      {
        path: "calendar",
        element: <CalendarPage />,
        routeMetadata: {
          pageIdentifier: 'calendar',
        },
      },
      {
        path: "ai-assistant",
        element: <AIAssistantPage />,
        routeMetadata: {
          pageIdentifier: 'ai-assistant',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
