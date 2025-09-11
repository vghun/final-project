import config from "~/config";
import Home from "~/pages/home";
import Product from "~/pages/product";
import ProductDetails from "~/pages/ProductDetails";
import Profile from "~/pages/profile";
import About from "~/pages/about";

const publicRouter = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.product, component: Product },
  { path: config.routes.productDetails, component: ProductDetails },
  {path : config.routes.about, component: About}
];

const privateRoutes = [];

export { publicRouter, privateRoutes };
