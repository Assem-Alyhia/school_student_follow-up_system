import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/layout";
import MiniDrawer from "./layout/drawer";
import Login from "./auth/login/Login";
import Register from "./auth/register/Register";
import ForgetPassword from "./auth/forgetPassword/forgetPassword";
import ResetPassword from "./auth/resetPassword/ResetPassword";
import PasswordResetSuccess from "./auth/passwordResetSuccess/PasswordResetSuccess";
import PrivateRoute from "./auth/privateRoute/PrivateRoute";

import Dashboard from './pages/dashboard';
import User from "./pages/user";
import Roles from "./pages/user/roles";
import Students from "./pages/students";
import Teachers from "./pages/teachers";
import Guardian from "./pages/guardian";
import AcademicStages from "./pages/academicStages";
import Lessons from "./pages/Lessons";
import Grades from "./pages/grades";
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
import ParentProfile from "./components/ParentRole/ProfilePage";
import ParentSettingNavigation from "./components/ParentRole/ParentSettings/settingNavigation";
import ParentStudents from "./pages/ParentRole/Student";
import ParentExamLists from "./pages/ParentRole/Exams/Examlists";
import AdminClassesLists from "./pages/Exams/Classes";
import AdminExamLists from './pages/Exams/Examlists';
import AdminTypesExams from "./pages/Exams/TypesExams";
import AdminResultsExam from "./pages/Exams/ExamGrades";
import ParentTeacher from "./components/ParentRole/Teachers/Section1";
import ParentPayments from "./pages/ParentRole/Payments";
import PGradesList from "./pages/ParentRole/Grades";
import ParentResultsExam from "./pages/ParentRole/Exams/ExamGrades";
import NavigationSectionStudent from "./components/ParentRole/Students/Section2/NavigationSectionLessone";
import SupervisorDrawer from "./layout/supervisorDrawer";
import SupervisorProfile from "./components/SupervisorRole/ProfilePage";
import SupervisorDashboard from "./pages/SupervisorRole/dashboard";
import SupervisorStudents from "./pages/SupervisorRole/Students";
import StudentDetails from "./components/SupervisorRole/Students/studentDetails";
import ErrorPage from "./components/common/ErrorPage";
import SupervisorParents from "./pages/SupervisorRole/Parent";
import SupervisorBuses from "./pages/SupervisorRole/Buses";
import Supervisor from "./pages/Supervisor";
import StudentDrawer from "./layout/studentDrawer";
import StudentProfile from "./components/StudentRole/ProfilePage";
import StudentDashboard from "./pages/StudentRole/dashboard";
import StudentStudents from "./pages/StudentRole/Students";
import StudentTeachers from "./pages/StudentRole/Teachers";
import StudentSubjects from "./pages/StudentRole/Subjects";
import StudentClassrooms from "./pages/StudentRole/Classrooms";
import StudentSchedules from "./pages/StudentRole/Schedules";
import StudentExamsList from "./pages/StudentRole/Exam/Examlists";
import StudentExamGrades from "./pages/StudentRole/Exam/ExamGrades";
import StudentGrades from "./pages/StudentRole/Grades";
import StudentBuses from "./pages/StudentRole/Buses";
import FinancialDrawer from "./layout/financialDrawer";
import FinancialProfile from "./components/FinancialRole/ProfilePage";
import FinancialDashboard from "./pages/FinancialRole/dashboard";
import FinancialStudents from "./pages/FinancialRole/Students";
import FinancialParents from "./pages/FinancialRole/Parents";
import Financials from "./pages/Financials";
import FinancialPayments from "./pages/FinancialRole/Payments";
import Installment from "./pages/Installment";
import StudentCommentsPage from "./components/StudentRole/Comments/StudentCommentsPage";

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
  { path: "supervisor", element: <Supervisor /> },
  { path: "financials", element: <Financials /> },
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
  { path: "installment", element: <Installment /> },
  { path: "exam/classesLists", element: <AdminClassesLists /> },
  { path: "exam/examlists", element: <AdminExamLists /> },
  { path: "exam/typesExams", element: <AdminTypesExams /> },
  { path: "exam/resultsExams", element: <AdminResultsExam /> },
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
  { path: "grades", element: <TeacherGrades /> },
];


const parentDashboardRoutes = [
  { path: "", element: <ParentDashboard /> },
  { path: "profile", element: <ParentProfile /> },
  { path: "settings", element: <ParentSettingNavigation /> },
  { path: "students", element: <ParentStudents /> },
  { path: "students/studentDetails", element: <NavigationSectionStudent /> },
  { path: "teachers", element: <ParentTeacher /> },
  { path: "exam/examlists", element: <ParentExamLists /> },
  { path: "exam/resultsExams", element: <ParentResultsExam /> },
  { path: "grades", element: <PGradesList /> },
  { path: "payments", element: <ParentPayments /> },
];


const supervisorDashboard = [
  { path: "", element: <SupervisorDashboard /> },
  { path: "profile", element: <SupervisorProfile /> },
  { path: "settings", element: <ParentSettingNavigation /> },
  { path: "students", element: <SupervisorStudents /> },
  { path: "supervisorStudent/studentDetails/:id", element: <StudentDetails /> },
  { path: "parents", element: <SupervisorParents /> },
  { path: "buses", element: <SupervisorBuses /> },
];



const studentDashboard = [
  { path: "", element: <StudentDashboard /> },
  { path: "profile", element: <StudentProfile /> },
  { path: "settings", element: <ParentSettingNavigation /> },
  { path: "students", element: <StudentStudents /> },
  { path: "teachers", element: <StudentTeachers /> },
  { path: "subjects", element: <StudentSubjects /> },
  { path: "classrooms", element: <StudentClassrooms /> },
  { path: "schedules", element: <StudentSchedules /> },
  { path: "exams/lists", element: <StudentExamsList /> },
  { path: "exams/results", element: <StudentExamGrades /> },
  { path: "grades", element: <StudentGrades /> },
  { path: "buses", element: <StudentBuses /> },
  { path: "student/comments", element: <StudentCommentsPage /> },
];




const financialDashboard = [
  { path: "", element: <FinancialDashboard /> },
  { path: "profile", element: <FinancialProfile /> },
  { path: "settings", element: <ParentSettingNavigation /> },
  { path: "students", element: <FinancialStudents /> },
  { path: "parents", element: <FinancialParents /> },
  { path: "payments", element: <FinancialPayments /> },
];





export const router = createBrowserRouter([

  {
    path: "/",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ParentDrawer />,
        children: parentDashboardRoutes,
      },
    ],
  },





  {
    path: "/supervisorDashboard",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <SupervisorDrawer />,
        children: supervisorDashboard,
      },
    ],
  },




  {
    path: "/studentDashboard",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <StudentDrawer />,
        children: studentDashboard,
      },
    ],
  },





  {
    path: "/financialDashboard",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <FinancialDrawer />,
        children: financialDashboard,
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
