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
  createUser: "admin/users",
  // الطلاب
  getAllStudents: "admin/students",
  deleteStudent: (id) => `admin/students/${id}`,
  updateStudent: (id) => `admin/students/${id}`,
  getStudentById: "admin/students",
  createStudent: "admin/students",
  getStudentPaymentById: (id) => `admin/payments/${id}`,
  getScheduleById: (id) => `admin/schedules/${id}`,
  getAllStudentsNoPaginate: "/admin/students/get-all",
  // أولياء الأمور
  getAllParents: "admin/parents",
  getParentById: (id) => `admin/parents/${id}`,
  createParent: "/admin/parents",
  deleteParent: (id) => `admin/parents/${id}`,
  updateParent: (id) => `admin/parents/${id}`,
  getAllParentsNoPaginate: "admin/parents/get-all",
  // الصفوف
  getAllClassrooms: "admin/classrooms",
  getAllClassroomsNoPaginate: "admin/classrooms/get-all",
  getClassroomById: (id) => `admin/classrooms/${id}`,
  createClassroom: "admin/classrooms",
  updateClassroom: (id) => `admin/classrooms/${id}`,
  deleteClassroom: (id) => `admin/classrooms/${id}`,
  getAvailableClassrooms: "admin/classrooms/get-available",
  // المشرفين
  getAllSupervisors: "admin/supervisors",
  getAllSupervisorsNoPaginate: "admin/supervisors/get-all",
  getSupervisorById: (id) => `admin/supervisors/${id}`,
  // الرسوم
  getAllSchoolFees: "admin/school-fees",
  getAllSchoolFeesNoPaginate: "admin/school-fees/get-all",

  // المعلمون
  getAllTeachers: "admin/teachers",
  getTeacherById: (id) => `admin/teachers/${id}`,
  getAllTeachersNoPaginate: "admin/teachers/get-all",
  createTeacher: "/admin/teachers",
  updateTeacher: (id) => `admin/teachers/${id}`,
  deleteTeacher: (id) => `admin/teachers/${id}`,

  // المراحل الدراسية
  getLevelsStats: "admin/levels/home",
  getAllLevels: "/admin/levels/get-all",

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
  getStudentsGradesReports: "admin/students/grades-reports",

  // السنوات الدراسية
  getAllAcademicYearsNoPaginate: "admin/academic-years/get-all",

  //الجدول اليومي
  getDailySchedule: (classroomId, year) =>
    `admin/schedules/get-daily?classroom_id=${classroomId}&year=${year}`,

  createSchedule: "admin/schedules",
  updateSchedule: (id) => `admin/schedules/${id}`,

  // جداول الامتحانات
  getExamSchedule: (classroomId, year) =>
    `admin/schedules/get-exams?classroom_id=${classroomId}&year=${year}`,

  // جدول الاحداث
  getEventsSchedule: (classroomId, year) =>
    `admin/schedules/get-events?classroom_id=${classroomId}&year=${year}`,
  deleteSchedule: (id) => `admin/schedules/${id}`,

  //جدول الباصات
  getBusById: (id) => `admin/buses/${id}`,
  getAllBuses: "admin/buses",
  createBus: "admin/buses",
  updateBus: (id) => `admin/buses/${id}`,
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

  // المواد
  subjects: "/admin/subjects",
  subjectById: (id) => `/admin/subjects/${id}`,

  // ******************************************************************************
  // ******************************{techers}*****************************************
  // *****************************************************************************

  // الصفحة الشخصية
  getTeacherProfile: "teacher/profile",

  // الطلاب
  getTeacherStudents: "teacher/students",
  getTeacherStudentById: (id) => `teacher/students/${id}`,

  // اولياء الامور
  getTeacherParents: "teacher/parents",
  getTeacherParentById: (id) => `teacher/parents/${id}`,

  // المراحل الدراسية - للمعلم
  getTeacherLevels: "teacher/levels/home",
  getAllTeacherLevels: "teacher/levels",

  // المواد
  getTeacherSubjects: "teacher/subjects",

  // الصفوف
  getTeacherClassrooms: "teacher/classrooms/teacher-classrooms",
  getAllTeacherClassrooms: "teacher/classrooms/all-teacher-classrooms",

  // التقارير
  getTeacherSchedulesByClassroom: "/teacher/schedules",

  //الامتحانات
  getTeacherExamsList: "/teacher/exams",
  getTeacherExamTypes: "/teacher/exam-types",
};

export default apiEndpoints;
