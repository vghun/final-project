import config from "~/config";
import Home from "~/pages/home";
import Profile from "~/pages/profile";
import About from "~/pages/about";
import Admin from "~/pages/Admin";
import ThoCatToc from "~/pages/ThoCatToc";
import BookingPage from "~/pages/booking";

const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.about, component: About },
  { path: config.routes.admin, component: Admin, layout: null },
  { path: config.routes.thoCatToc, component: ThoCatToc, layout: null },
  { path: config.routes.booking, component: BookingPage },
];

const privateRoutes = [];

export { publicRouter, privateRoutes };
