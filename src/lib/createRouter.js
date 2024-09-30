import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getTarget = () => {
    return routes[window.location.pathname]
      ? routes[window.location.pathname]()
      : routes["/*"]();
  };

  const push = (path) => {
    window.history.pushState(null, null, path);
    notify();
  };

  window.addEventListener("popstate", () => notify());

  return { push, subscribe, getTarget };
};
