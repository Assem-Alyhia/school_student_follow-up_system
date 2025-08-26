const apiEndpoints = {
  // المصادقة
  login: "login",
  logout: "logout",
  register: "register",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  changePassword: "change-password",

  //داشبورد
  getAdminDashboard: "/admin/dashboard",

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
  topStudentsByLevel: (levelId) =>
    `admin/students/top-students?level_id=${levelId}`,
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
  createSupervisor: "admin/supervisors",
  updateSupervisor: (id) => `admin/supervisors/${id}`,
  deleteSupervisor: (id) => `admin/supervisors/${id}`,
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
  getAllLevelsPaginate: "/admin/levels",

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

  // الدرجات
  getAllGrades: "admin/grades",
  getStudentsGradesReports: "admin/students/grades-reports",
  createGrade: "admin/grades",
  updateGrade: "admin/grades",
  deleteGrade: "admin/grades",
  getGradeById: "admin/grades",

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

  //الامتحانات
  getAdminExams: "admin/exams",
  createAdminExam: "admin/exams",
  getAdminExamById: (gradeId) => `teacher/exams/${gradeId}`,
  deleteAdminExam: (gradeId) => `teacher/exams/${gradeId}`,
  updateAdminExam: (gradeId) => `teacher/exams/${gradeId}`,

  //انواع الامتحانات
  getAllExamTypes: "admin/exam-types",
  getAllExamTypesNoPaginate: "admin/exam-types/get-all",
  getExamTypeById: (id) => `admin/exam-types/${id}`,
  createExamType: "admin/exam-types",
  updateExamType: (id) => `admin/exam-types/${id}`,
  deleteExamType: (id) => `admin/exam-types/${id}`,

  //نتائج الامتحانات
  getAllExamResults: "admin/exam-results",
  getAllExamResultsNoPaginate: "admin/exam-results/get-all",
  getExamResultById: (id) => `admin/exam-results/${id}`,
  createExamResult: "admin/exam-results",
  updateExamResult: (id) => `admin/exam-results/${id}`,
  deleteExamResult: (id) => `admin/exam-results/${id}`,

  // الطلاب ضمن الصف
  getAdminStudentsInClassroom: (classroomId) =>
    `/admin/students/get-in-classroom/${classroomId}`,


  // المالية
  getAllFinancials: "admin/financials", 
  createFinancial: "admin/financials", 
  getAllFinancialsNoPaginate: "admin/financials/get-all", 
  getFinancialById: (id) => `admin/financials/${id}`, 
  updateFinancial: (id) => `admin/financials/${id}`, 
  deleteFinancial: (id) => `admin/financials/${id}`,

  // *****************************************************************************
  // ******************************{techers}**************************************
  // *****************************************************************************

  // الصفحة الشخصية
  getTeacherProfile: "teacher/profile",
  updateTeacherProfile: (id) => `teacher/profile/${id}`,

  // الطلاب
  getTeacherStudents: "teacher/students",
  getTeacherStudentById: (id) => `teacher/students/${id}`,
  getStudentsInClassroom: (classroomId) =>
    `/teacher/students/get-in-classroom/${classroomId}`,

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
  createTeacherExam: "/teacher/exams",
  getTeacherExamById: (id) => `/teacher/exams/${id}`,
  updateTeacherExam: (id) => `/teacher/exams/${id}`,
  deleteTeacherExam: (id) => `/teacher/exams/${id}`,

  getTeacherExamResults: "/teacher/exam-results",
  createTeacherExamResults: "/teacher/exam-results",
  getTeacherExamResultById: (id) => `/teacher/exam-results/${id}`,
  updateTeacherExamResult: (id) => `/teacher/exam-results/${id}`,
  deleteTeacherExamResult: (id) => `/teacher/exam-results/${id}`,
  getTeacherExamTypes: "/teacher/exam-types",

  // الدرجات
  getTeacherGrades: "/teacher/grades",
  getTeacherGradeById: (gradeId) => `teacher/grades/${gradeId}`,
  createTeacherGrades: `teacher/grades`,
  deleteTeacherGrade: (gradeId) => `teacher/grades/${gradeId}`,
  updateTeacherGrade: (gradeId) => `teacher/grades/${gradeId}`,

  // *****************************************************************************
  // ******************************{parent}***************************************
  // *****************************************************************************

  // الصفحة الشخصية
  getParentProfile: "parent/profile",
  updateParentProfile: (parentId) => `parent/profile/${parentId}`,

  // التقارير
  getParentSchedules: "parent/schedules",
  getParentSchedulesByClassroom: "parent/schedules/classroom",

  // المدفوعات
  getParentPayments: "parent/payments",

  // الامتحانات
  getParentExams: "parent/exams",
  getParentExamResults: "parent/exam-results",

  // المعلمين
  getParentTeachers: "parent/teachers",

  // الدرجات
  getParentGrades: "/parent/grades",

  //الاولاد الطلاب
  getParentStudents: "/parent/students",

  // الموقع
  getParentStudentLocation: (supervisorId) =>
    `parent/locations/${supervisorId}`,

  // *****************************************************************************
  // ******************************{supervisor}***********************************
  // *****************************************************************************

  // الصفحة الشخصية
  getSupervisorProfile: "supervisor/profile",
  updateSupervisorProfile: (supervisorId) =>
    `supervisor/profile/${supervisorId}`,

  // الطلاب
  getSupervisorStudents: "supervisor/students",
  getSupervisorStudentsNoPaginate: "supervisor/students/get-all",
  getSupervisorStudentById: (id) => `supervisor/students/${id}`,
  updateSupervisorStudent: (id) => `supervisor/students/${id}`,

  // الآباء
  getSupervisorParents: "supervisor/parents",

  // الباصات
  getSupervisorBuses: "supervisor/buses",

  // الموقع
  getSupervisorStudentLocation: "supervisor/locations",
  storeSupervisorLocation: "supervisor/locations",

  // *****************************************************************************
  // ******************************{student}**************************************
  // *****************************************************************************

  // الصفحة الشخصية - الطالب
  getStudentProfile: "student/profile",
  updateStudentProfile: (studentId) => `student/profile/${studentId}`,

  // الطلاب - قائمة
  getStudents: "student/students",

  // المعلمون (للطلاب)
  getStudentTeachers: "student/teachers",

  // مواد الطالب
  getStudentSubjects: "student/subjects",

  // صفوف الطالب
  getStudentClassrooms: "student/classrooms",

  // جداول الطالب (الحصص/الجدول اليومي/الأسبوعي)
  getStudentSchedules: "student/schedules",

  // الامتحانات
  getStudentExams: "student/exams",
  getStudentExamGrades: "student/exam-results",

  // الدرجات
  getStudentGrades: "student/grades",

  // الباصات
  getStudentBuses: "student/buses",

  // *****************************************************************************
  // ******************************{Financial}************************************
  // *****************************************************************************

  // Profile
  finGetProfile: "financial/profile",
  updateFinancialProfile: (financialId) => `financial/profile/${financialId}`,

  // Students
  finGetStudents: "financial/students",
  finGetAllStudents: "financial/students/get-all",

  // Teachers
  finGetTeachers: "financial/teachers",
  finGetAllTeachers: "financial/teachers/get-all",

  // Parents
  finGetParents: "financial/parents",
  finGetAllParents: "financial/parents/get-all",
  finGetParentById: (parentId) => `financial/parents/${parentId}`,

  // School Fees
  finGetSchoolFees: "financial/school-fees",
  finGetAllSchoolFees: "financial/school-fees/get-all",

  // Payments
  finGetPayments: "financial/payments",
  finCreatePayment: "financial/payments",
  finGetAllPayments: "financial/payments/get-all",
  finGetPaymentsByStudent: (studentId) =>
    `financial/payments/get-by-student/${studentId}`,
  finGetPaymentById: (paymentId) => `financial/payments/${paymentId}`,
  finUpdatePayment: (paymentId) => `financial/payments/${paymentId}`,
};

export default apiEndpoints;
