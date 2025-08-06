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
  getUserById: (id) => `admin/users/${id}`,
  deleteUser: (id) => `admin/users/${id}`,
  updateUser: (id) => `admin/users/${id}`,
  // الطلاب
  getAllStudents: "admin/students",
  deleteStudent: (id) => `admin/students/${id}`,
  updateStudent: (id) => `admin/students/${id}`,
  getStudentById: "admin/students",
  createStudent: "admin/students",
  getStudentPaymentById: (id) => `admin/payments/${id}`,
  getScheduleById: (id) => `admin/schedules/${id}`,
  // أولياء الأمور
  getAllParents: "admin/parents",
  getParentById: (id) => `admin/parents/${id}`,
  deleteParent: (id) => `admin/parents/${id}`,
  getAllParentsNoPaginate: "admin/parents/get-all",
  // الصفوف
  getAllClassrooms: "admin/classrooms",
  getAllClassroomsNoPaginate: "admin/classrooms/get-all",
  getClassroomById: (id) => `admin/classrooms/${id}`,
  deleteClassroom: (id) => `admin/classrooms/${id}`,
  // المشرفين
  getAllSupervisors: "admin/supervisors",
  getAllSupervisorsNoPaginate: "admin/supervisors/get-all",
  getSupervisorById: (id) => `admin/supervisors/${id}`,
  // الرسوم
  getAllSchoolFees: "admin/school-fees",
  getAllSchoolFeesNoPaginate: "admin/school-fees/get-all",

  // المعلمون
  getAllTeachers: "admin/teachers",
  getAllTeachersNoPaginate: "admin/teachers/get-all",
  deleteTeacher: (id) => `admin/teachers/${id}`,

  // المراحل الدراسية
  getLevelsStats: "admin/levels/home",

  //الادوار
  getAllRoles: "/admin/roles",
  createRole: "admin/roles",
  getRoleById: (id) => `admin/roles/${id}`,
  updateRole: (id) => `admin/roles/${id}`,
  deleteRole: (id) => `admin/roles/${id}`,

  // الصلاحيات
  getPermissionById: (id) => `admin/permissions/${id}`,
  getAllPermissions: "admin/permissions",
  createPermission: "admin/permissions",
  deletePermission: (id) => `admin/permissions/${id}`,
  updatePermission: (id) => `admin/permissions/${id}`,

  // نتائج الامتحانات
  getStudentExamResults: (studentId) =>
    `admin/exam-results?student_id=${studentId}`,
  getAllExamResults: "admin/exam-results",

  // الدرجات
  getAllGrades: "admin/grades",

  // السنوات الدراسية
  getAllAcademicYearsNoPaginate: "admin/academic-years/get-all",

  //الجدول اليومي
  getDailySchedule: (classroomId, year) =>
    `admin/schedules/get-daily?classroom_id=${classroomId}&year=${year}`,

  // جداول الامتحانات
  getExamSchedule: (classroomId, year) =>
    `admin/schedules/get-exams?classroom_id=${classroomId}&year=${year}`,

  // جدول الاحداث
  getEventsSchedule: (classroomId, year) =>
    `admin/schedules/get-events?classroom_id=${classroomId}&year=${year}`,
  deleteSchedule: (id) => `admin/schedules/${id}`,

  //جدول الباصات
  getAllBuses: "admin/buses",
  deleteBus: (id) => `admin/buses/${id}`,

  // المواقع
  getSupervisorLocation: (supervisorId) => `admin/locations/${supervisorId}`,

  // المدفوعات
  getAllPayments: "admin/payments",
  getAllPaymentsNoPaginate: "admin/payments/get-all",
  getPaymentById: (id) => `admin/payments/${id}`,
  createPayment: "admin/payments",
  updatePayment: (id) => `admin/payments/${id}`,
  deletePayment: (id) => `admin/payments/${id}`,
};

export default apiEndpoints;
