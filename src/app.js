import router from "./router";
import customEventListener from "./customEventListener";
import { HOME_PAGE, LOGIN_PAGE, PROFILE_PAGE, USERNAME } from "./constants";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import userStore from "./store/userStore";

const loginPageGuard = (path) => {
  return !!userStore.getState()[USERNAME] ? HOME_PAGE : path;
};

const profilePageGuard = (path) => {
  return !userStore.getState()[USERNAME] ? LOGIN_PAGE : path;
};

export default function App($root) {
  router.addRoute(HOME_PAGE, () => {
    new HomePage($root);
  });
  router.addRoute(
    LOGIN_PAGE,
    () => {
      new LoginPage($root);
    },
    loginPageGuard
  );
  router.addRoute(
    PROFILE_PAGE,
    () => {
      new ProfilePage($root);
    },
    profilePageGuard
  );
  router.addNotFoundRoute(() => {
    new NotFoundPage($root);
  });

  router.push(router.currentPath());
}

customEventListener();
