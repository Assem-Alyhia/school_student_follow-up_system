import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/layout";
import MiniDrawer from "./layout/drawer";
import Login from "./auth/login/Login";
import Register from "./auth/register/Register";
import ForgetPassword from "./auth/forgetPassword/forgetPassword";
import ResetPassword from "./auth/resetPassword/ResetPassword";
import PasswordResetSuccess from "./auth/passwordResetSuccess/PasswordResetSuccess";
import PrivateRoute from "./auth/privateRoute/PrivateRoute";

// صفحات الـ Dashboard
import Dashboard from './pages/dashboard';
import User from "./pages/user";
import Roles from "./pages/user/roles";
import Students from "./pages/students";
import Teachers from "./pages/teachers";
import Guardian from "./pages/guardian";
import AcademicStages from "./pages/academicStages";
import Lessons from "./pages/Lessons";
import Grades from "./pages/grades";
import StudentsAttending from "./pages/studentsAttending";
import SchoolTransportation from "./pages/schoolTransportation";
import TeacherManagement from "./pages/teachers/teacherManagement";
import StudentForm from "./components/Students/studentForAdd";
import StudentManagement from "./pages/students/aboutStudent";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";
import StudentEditForm from "./components/Students/updateStudent";
import Classes from "./pages/Classes";
import Permissions from "./pages/user/permissions";
import _AddRolse from './pages/user/roles/addRolse/index';
import UpdateRole from "./components/User/Roles/updateRole";
import UserProfile from "./components/ProfilePage";
import SettingNavigation from "./components/UsersSettings/settingNavigation";
import UpdateUser from "./components/User/UpdateUser";
import StudentScheduleDetails from "./components/Students/aboutStudent/StudentScheduleDetails/StudentScheduleDetails";
import TeacherDrawer from "./layout/teacherDrawer";
import TeacherForAdd from "./components/Teachers/teacherForAdd";
import ParentFormAdd from "./components/Guardian/ParentFormAdd";
import ParentFormUpdate from "./components/Guardian/ParentFormUpdate";
import TeacherFormUpdate from "./components/Teachers/TeacherFormUpdate";
import TeacherProfile from "./components/TeacherRole/ProfilePage";
import TeacherSettingNavigation from "./components/TeacherRole/TeacherSettings/settingNavigation";
import TeacherDashboard from "./pages/TeacherRole/dashboard";
import TeacherStudents from "./pages/TeacherRole/Students";
import TStudentDetails from "./components/TeacherRole/Students/studentDetails";
import TeacherParents from "./pages/TeacherRole/Parents";
import TParentDetails from "./components/TeacherRole/Parents/parentDetails";
import TLevelsSection from "./pages/TeacherRole/AcademicStages";
import TeacherSubjects from "./pages/TeacherRole/Subjects";
import TeacherClassrooms from "./pages/TeacherRole/Classrooms";
import NavigationCalendarSchedule from "./components/TeacherRole/Lessons/NavigationDailySchedule";
import TeacherClassesLists from "./pages/TeacherRole/Exams/Classes";
import TeacherExamLists from "./pages/TeacherRole/Exams/Examlists";
import TeacherTypesExams from "./pages/TeacherRole/Exams/TypesExams";
import TeacherResultsExam from "./pages/TeacherRole/Exams/ExamGrades";
import TeacherGrades from "./pages/TeacherRole/Grades";
import ParentDashboard from "./pages/ParentRole/dashboard";
import ParentDrawer from './layout/parentDrawer/index';

const dashboardRoutes = [
  { path: "", element: <Dashboard /> },
  { path: "student-schedule-details/:studentId/:year/:month/:day", element: <StudentScheduleDetails /> },
  { path: "users", element: <User /> },
  { path: "users/usersProfile/:id", element: <UserProfile /> },
  { path: "users/usersSettings/:id", element: <SettingNavigation /> },
  { path: "users/updateUser/:id", element: <UpdateUser /> },
  { path: "users/roles", element: <Roles /> },
  { path: "users/rolse/editRolse/:id", element: <UpdateRole /> },
  { path: "users/rolse/addRolse", element: <_AddRolse /> },
  { path: "users/permissions", element: <Permissions /> },
  { path: "students", element: <Students /> },
  { path: "teachers", element: <Teachers /> },
  { path: "teachers/teacherFormAdd", element: <TeacherForAdd /> },
  { path: "teacher/updateTeacher/:id", element: <TeacherFormUpdate /> },
  { path: "guardian", element: <Guardian /> },
  { path: "guardian/parentFormAdd", element: <ParentFormAdd /> },
  { path: "guardian/parentFormEdit/:id", element: <ParentFormUpdate /> },
  { path: "academicStages", element: <AcademicStages /> },
  { path: "lessons", element: <Lessons /> },
  { path: "grades", element: <Grades /> },
  { path: "fees", element: <Fees /> },
  { path: "reports", element: <Reports /> },
  { path: "classes", element: <Classes /> },
  { path: "studentsAttending", element: <StudentsAttending /> },
  { path: "schoolTransportation", element: <SchoolTransportation /> },
  { path: "teacher/teacherManagement", element: <TeacherManagement /> },
  { path: "student/studentFormAdd", element: <StudentForm /> },
  { path: "student/studentManagement/:id", element: <StudentManagement /> },
  { path: "student/updateStudent/:id", element: <StudentEditForm /> },
];


const teacherDashboardRoutes = [
  { path: "", element: <TeacherDashboard /> },
  { path: "profile", element: <TeacherProfile /> },
  { path: "settings", element: <TeacherSettingNavigation /> },
  { path: "students", element: <TeacherStudents /> },
  { path: "students/tStudentDetails/:id", element: <TStudentDetails /> },
  { path: "parents", element: <TeacherParents /> },
  { path: "parents/tParentDetails/:id", element: <TParentDetails /> },
  { path: "levels", element: <TLevelsSection /> },
  { path: "subjects", element: <TeacherSubjects /> },
  { path: "classrooms", element: <TeacherClassrooms /> },
  { path: "calendarSchedule", element: <NavigationCalendarSchedule /> },
  { path: "exam/classesLists", element: <TeacherClassesLists /> },
  { path: "exam/examlists", element: <TeacherExamLists /> },
  { path: "exam/typesExams", element: <TeacherTypesExams /> },
  { path: "exam/resultsExams", element: <TeacherResultsExam /> },
  { path: "grades", element: <TeacherGrades/> },
];


const parentDashboardRoutes = [
  { path: "", element: <ParentDashboard /> },
  // { path: "profile", element: <TeacherProfile /> },
  // { path: "settings", element: <TeacherSettingNavigation /> },
  // { path: "students", element: <TeacherStudents /> },
  // { path: "students/tStudentDetails/:id", element: <TStudentDetails /> },
  // { path: "parents", element: <TeacherParents /> },
  // { path: "parents/tParentDetails/:id", element: <TParentDetails /> },
  // { path: "levels", element: <TLevelsSection /> },
  // { path: "subjects", element: <TeacherSubjects /> },
  // { path: "classrooms", element: <TeacherClassrooms /> },
  // { path: "calendarSchedule", element: <NavigationCalendarSchedule /> },
  // { path: "exam/classesLists", element: <TeacherClassesLists /> },
  // { path: "exam/examlists", element: <TeacherExamLists /> },
  // { path: "exam/typesExams", element: <TeacherTypesExams /> },
  // { path: "exam/resultsExams", element: <TeacherResultsExam /> },
  // { path: "grades", element: <TeacherGrades/> },
];





export const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Layout />,
  //   errorElement: <p>Page not found</p>,
  // },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <MiniDrawer />,
        children: dashboardRoutes,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <MiniDrawer />,
        children: dashboardRoutes,
      },
    ],
  },




  {
    path: "/teacherDashboard",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <TeacherDrawer />,
        children: teacherDashboardRoutes,
      },
    ],
  },




  {
    path: "/parentDashboard",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <ParentDrawer />,
        children: parentDashboardRoutes,
      },
    ],
  },




  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/password-resetSuccess",
    element: <PasswordResetSuccess />,
  },
]);
