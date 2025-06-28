const apiEndpoints = {
  login: "login",
  logout: "logout",
  register: "register",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  changePassword: "change-password",



  getAllUsers: "admin/users",
  deleteUser: (id) => `admin/users/${id}`,
};

export default apiEndpoints;
