import config from "~/config";
import Home from "~/pages/home";
import Profile from "~/pages/profile";
import About from "~/pages/about";

const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  {path : config.routes.about, component: About}
];

const privateRoutes = [];

export { publicRouter, privateRoutes };
