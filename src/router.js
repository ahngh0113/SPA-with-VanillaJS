import { HOME_PAGE, LOGIN_PAGE, PROFILE_PAGE, USERNAME } from "./constants";
import userStore from "./store/userStore";

class Router {
  constructor() {
    this.routes = [];
    this.notfound = () => {};
    window.addEventListener("popstate", () => {
      const path = window.location.pathname;

      this.push(path);
    });
  }

  currentPath() {
    return window.location.pathname;
  }

  addRoute(path, handler, routerGuard = null) {
    this.routes[path] = { handler, routerGuard };
  }

  addNotFoundRoute(handler) {
    this.notfound = handler;
  }

  push(path) {
    const route = this.routes[path];
    if (route) {
      const validPath = route.routerGuard ? route.routerGuard(path) : path;
      history.pushState({}, "", validPath);

      const handler = this.routes[validPath]?.handler;
      if (handler) {
        handler();
      } else {
        this.notfound();
      }
    } else {
      this.notfound();
    }
  }
}

const router = new Router();

export default router;
