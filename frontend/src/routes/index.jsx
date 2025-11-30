import config from "~/config";
import Home from "~/pages/home";
import Profile from "~/pages/profile";
import About from "~/pages/about";
import Admin from "~/pages/Admin";
import ThoCatToc from "~/pages/ThoCatToc";
import BookingPage from "~/pages/booking";
import BookingHistory from "~/pages/bookingHistory";
import Reel from "~/pages/reels";
import BarberPage from "~/pages/team";
import  BarberProfile from "~/pages/BarberProfile";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { DefaultLayout } from "~/layouts"; 
import HairConsult from "~/pages/HairConsult";

export const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.about, component: About },
  { path: config.routes.reels, component: Reel },
  { path: config.routes.team, component: BarberPage },
  { path: config.routes.barberProfile, component: BarberProfile },
  {path: config.routes.hairConsult, // thêm route hairConsult
    component: HairConsult},
  
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
    layout: DefaultLayout,
    hideFooter: true,
  },
  {
    path: config.routes.bookingHistory,
    component: () => (
      <ProtectedRoute>
        <BookingHistory />
      </ProtectedRoute>
    ),
    layout: DefaultLayout,
    hideFooter: true,
  },
];

export const privateRoutes = [];