"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRoute = void 0;
const express_1 = __importDefault(require("express"));
const attendance_controller_1 = require("./attendance.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.teacher), attendance_controller_1.AttendanceController.createAttendacne);
exports.AttendanceRoute = router;
