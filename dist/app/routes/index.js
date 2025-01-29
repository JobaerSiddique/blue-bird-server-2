"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const class_route_1 = require("../module/class/class.route");
const user_route_1 = require("../module/user/user.route");
const student_route_1 = require("../module/student/student.route");
const auth_route_1 = require("../module/auth/auth.route");
const teacher_route_1 = require("../module/teacher/teacher.route");
const attendance_route_1 = require("../module/attendance/attendance.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoute
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/class',
        route: class_route_1.ClassRoutes
    },
    {
        path: '/student',
        route: student_route_1.StudentRoutes
    },
    {
        path: '/teacher',
        route: teacher_route_1.TeacherRoutes
    },
    {
        path: '/attendance',
        route: attendance_route_1.AttendanceRoute
    }
];
moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
