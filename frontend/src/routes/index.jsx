import config from "~/config";
import Home from "~/pages/home";
import Profile from "~/pages/profile";

const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
];

const privateRoutes = [];

export { publicRouter, privateRoutes };
