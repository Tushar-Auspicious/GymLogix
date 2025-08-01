const ENDPOINTS = {
  signup: `user/signup`,
  signin: `user/signin`,
  forgotpassword: `user/forgot-password`,
  reset_password: `user/password-reset`,
  getUser: `user/get`,
  planGet: `plan/get`,
  foodGet: `food/get`,
  getMeal: `meal/get`,
  allGet: `all/get`,
  exerciseGet: `exercise/get`,
  foodCreate: `food/create_update`,
  mealCreate: `meal/create_update`,
  uploadFile: `asset/upload?asset`,
  schedule: `schedule/get`,
  createSchedule: `schedule/create_update`,
  create_update_exercise: `exercise/create_update?`,
  create_plan: `plan/create_update`,
};

export default ENDPOINTS;
