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
  getStudentPaymentById: (id) => `admin/payments/${id}`,
  getScheduleById: (id) => `admin/schedules/${id}`,
  // أولياء الأمور
  getAllParents: "admin/parents",
  deleteParent: (id) => `admin/parents/${id}`,
  getAllParentsNoPaginate: "admin/parents/get-all",
  // الصفوف
  getAllClassrooms: "admin/classrooms",
  getAllClassroomsNoPaginate: "admin/classrooms/get-all",
  // المشرفين
  getAllSupervisors: "admin/supervisors",
  getAllSupervisorsNoPaginate: "admin/supervisors/get-all",
  // الرسوم
  getAllSchoolFees: "admin/school-fees",
  getAllSchoolFeesNoPaginate: "admin/school-fees/get-all",

  // المعلمون
  getAllTeachers: "admin/teachers",
  getAllTeachersNoPaginate: "admin/teachers/get-all",
};

export default apiEndpoints;
