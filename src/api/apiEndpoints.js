const apiEndpoints = {
  // المصادقة
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
  getStudentById: "admin/students",
  createStudent: "admin/students",

  // أولياء الأمور
  getAllParents: "admin/parents",

  // الصفوف
  getAllClassrooms: "admin/classrooms",

  // المشرفين
  getAllSupervisors: "admin/supervisors",

  // الرسوم
  getAllSchoolFees: "admin/school-fees",
};

export default apiEndpoints;
