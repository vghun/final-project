import config from "~/config";
import Home from "~/pages/home";
import Profile from "~/pages/profile";
import About from "~/pages/about";
import Admin from "~/pages/Admin";
import ThoCatToc from "~/pages/ThoCatToc";
import BookingPage from "~/pages/booking";
import Reel from "~/pages/reels";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.about, component: About },
  { path: config.routes.reels, component: Reel },
  

  {
    path: config.routes.admin,
    component: () => (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    layout: null,
  },
  {
    path: config.routes.thoCatToc,
    component: () => (
      <ProtectedRoute requiredRole="barber">
        <ThoCatToc />
      </ProtectedRoute>
    ),
    layout: null,
  },
  {
    path: config.routes.booking,
    component: () => (
      <ProtectedRoute>
        <BookingPage />
      </ProtectedRoute>
    ),
  },
];

export const privateRoutes = [];