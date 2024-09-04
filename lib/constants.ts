export const userNameRegex =
  /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$/;

export const routes = {
  home: '/',
  signup: '/signup',
  login: '/login',
  dashboard: '/dashboard',
};
