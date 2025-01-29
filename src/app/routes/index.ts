import express from 'express';
import { ClassRoutes } from '../module/class/class.route';
import { UserRoutes } from '../module/user/user.route';
import { StudentRoutes } from '../module/student/student.route';
import { AuthRoute } from '../module/auth/auth.route';
import { TeacherRoutes } from '../module/teacher/teacher.route';
import { AttendanceRoute } from '../module/attendance/attendance.route';


const router = express.Router();

const moduleRoutes = [
    {
       path:'/auth',
       route:AuthRoute
    },
    {
       path:'/user',
       route: UserRoutes
    },
    {
        path:'/class',
        route:ClassRoutes
    },
    {
        path:'/student',
        route:StudentRoutes
    },
    {
        path:'/teacher',
        route:TeacherRoutes
    },
    {
        path:'/attendance',
        route:AttendanceRoute
    }
]



moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});

export default router;