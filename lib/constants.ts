export const userNameRegex =
  /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$/;

export const routes = {
  home: '/',
  signup: '/signup',
  login: '/login',
  dashboard: '/dashboard',
} as const;

export const queryKeys = {
  adminProjects: 'admin-projects',
  publicProjects: 'public-projects',
} as const;

export const redisKeys = {
  publicProjectsData: 'publicProjectsData',
} as const;

export const resumeDownloadUrl =
  'https://drive.google.com/uc?export=download&id=1V4gZ9QlCVPAIJSlIguyUdw0F9NiC78nw';
export const resumePreviewUrl =
  'https://drive.google.com/file/d/1V4gZ9QlCVPAIJSlIguyUdw0F9NiC78nw/view';
