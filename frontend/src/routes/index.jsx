// routes/index.jsx
import config from "~/config";
import Home from "~/pages/home";
import Profile from "~/pages/profile";
import About from "~/pages/about";
import Admin from "~/pages/Admin";
import ThoCatToc from "~/pages/ThoCatToc";
import BookingPage from "~/pages/booking";
import { ProtectedRoute } from "../components/ProtectedRoute"; // Lưu ý: import { ProtectedRoute } chứ không default

export const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.about, component: About },
  { path: config.routes.admin, component: Admin, layout: null },
  { path: config.routes.thoCatToc, component: ThoCatToc, layout: null },
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
