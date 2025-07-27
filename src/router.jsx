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
import SelectRoles from "./pages/user/selectRoles";
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

const dashboardRoutes = [
  { path: "", element: <Dashboard /> },
  { path: "users", element: <User /> },
  { path: "users/roles", element: <Roles /> },
  { path: "users/roles/selectRoles", element: <SelectRoles /> },
  { path: "students", element: <Students /> },
  { path: "teachers", element: <Teachers /> },
  { path: "guardian", element: <Guardian /> },
  { path: "academicStages", element: <AcademicStages /> },
  { path: "lessons", element: <Lessons /> },
  { path: "grades", element: <Grades /> },
  { path: "studentsAttending", element: <StudentsAttending /> },
  { path: "schoolTransportation", element: <SchoolTransportation /> },
  { path: "teacher/teacherManagement", element: <TeacherManagement /> },
  { path: "student/studentFormAdd", element: <StudentForm /> },
  { path: "student/studentManagement/:id", element: <StudentManagement /> },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <p>Page not found</p>,
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
