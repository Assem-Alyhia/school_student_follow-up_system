const apiEndpoints = {
  login: "login",
  logout: "logout",
  register: "register",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  changePassword: "change-password",

  // المستخدمون
  getAllUsers: "admin/users",
  deleteUser: (id) => `admin/users/${id}`,

  // الطلاب
  getAllStudents: "admin/students",
  deleteStudent: (id) => `admin/students/${id}`,
  getStudentById: 'admin/students'
};

export default apiEndpoints;
