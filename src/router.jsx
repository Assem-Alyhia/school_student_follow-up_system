import { createBrowserRouter } from "react-router-dom";
import Dashboard from './pages/dashboard';
import Login from './auth/login/Login';
import Register from './auth/register/Register';
import Layout from "./layout/layout";
import ForgetPassword from "./auth/forgetPassword/forgetPassword";
import Drawer from "./layout/drawer";
import MiniDrawer from "./layout/drawer";
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
import ResetPassword from "./auth/resetPassword/ResetPassword";
import PasswordResetSuccess from "./auth/passwordResetSuccess/PasswordResetSuccess";
import TeacherManagement from "./pages/teachers/teacherManagement";
import StudentForm from "./components/Students/studentForAdd";
import StudentManagement from "./pages/students/aboutStudent";








export const routes = [
    // {
    //     path: '/',
    //     element: <Dashboard />,
    // },
];



export const dashboardRoutes = [
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/dashboard/users',
      element: <User />,
    },
    {
      path: '/dashboard/users/roles',
      element: <Roles />,
    },
    {
      path: '/dashboard/users/roles/selectRoles',
      element: <SelectRoles/>,
    },
    {
      path: '/dashboard/students',
      element: <Students/>,
    },
    {
      path: '/dashboard/teachers',
      element: <Teachers/>,
    },
    {
      path: '/dashboard/guardian',
      element: <Guardian/>,
    },
    {
      path: '/dashboard/academicStages',
      element: <AcademicStages/>,
    },
    {
      path: '/dashboard/lessons',
      element: <Lessons/>,
    },
    {
      path: '/dashboard/grades',
      element: <Grades/>,
    },
    {
      path: '/dashboard/studentsAttending',
      element: <StudentsAttending/>,
    },
    {
      path: '/dashboard/schoolTransportation',
      element: <SchoolTransportation/>,
    },
    
    {
      path: '/dashboard/teacher/teacherManagement',
      element: <TeacherManagement/>,
    },


    {
      path: '/dashboard/student/studentFormAdd',
      element: <StudentForm/>,
    },

    
    {
      path: '/dashboard/student/studentManagement',
      element: <StudentManagement/>,
    },
]



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <p>not found page</p>,
    children: routes,
  },
  {
    path: "/dashboard",
    element: <MiniDrawer />,
    errorElement: <p>not found page</p>,
    children: dashboardRoutes,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgetPassword',
    element: <ForgetPassword />,
  },
  {
    path: '/resetPassword',
    element: <ResetPassword />,
  },
  {
    path: '/passwordResetSuccess',
    element: <PasswordResetSuccess />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
