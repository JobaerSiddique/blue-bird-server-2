"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("./student.controller");
const router = express_1.default.Router();
router.get('/', student_controller_1.StudentController.getAllStudent);
router.get('/:id', student_controller_1.StudentController.getSingleStudent);
router.delete('/:id', student_controller_1.StudentController.deleteStudent);
exports.StudentRoutes = router;
