"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherRoutes = void 0;
const express_1 = __importDefault(require("express"));
const teacher_controller_1 = require("./teacher.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = express_1.default.Router();
router.get('/', teacher_controller_1.TeacherController.getAllTeacher);
router.get('/:id', teacher_controller_1.TeacherController.singleTeacherInfo);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), teacher_controller_1.TeacherController.deleteTeacher);
exports.TeacherRoutes = router;
