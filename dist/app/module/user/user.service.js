"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const class_model_1 = require("../class/class.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const student_utils_1 = require("../student/student.utils");
const user_model_1 = require("./user.model");
const student_model_1 = require("../student/student.model");
const teaacher_utils_1 = require("../teacher/teaacher.utils");
const teacher_model_1 = require("../teacher/teacher.model");
const createStudentDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const userData = {};
        const newPassword = password || config_1.default.DEFAULT_PASS;
        const saltRounds = Number(config_1.default.SALT);
        const hashPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        userData.password = hashPassword;
        userData.email = payload.email;
        userData.role = "Student";
        const foundClass = yield class_model_1.Class.findById(payload.class);
        if (!foundClass) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Class Not Found');
        }
        const classId = new mongoose_1.default.Types.ObjectId(payload.class.toString());
        const studentId = yield (0, student_utils_1.generateStudentId)(payload.admissionYear, classId.toString());
        userData.id = studentId;
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create User");
        }
        payload.studentId = newUser[0].id;
        payload.user = newUser[0]._id;
        const newStudent = yield student_model_1.Student.create([payload], { session });
        if (!newStudent.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create Student");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newStudent;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const createTeacherDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        console.log("object", payload);
        const userData = {};
        const newPassword = password || config_1.default.TDEFAULT_PASS;
        const saltRounds = Number(config_1.default.SALT);
        const hashPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        userData.password = hashPassword;
        userData.email = payload.email;
        userData.role = "Teacher";
        yield session.startTransaction();
        const teacherId = yield (0, teaacher_utils_1.generateTeacherId)(payload.joiningYear);
        console.log(teacherId);
        userData.id = teacherId;
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create User");
        }
        payload.teacherId = newUser[0].id;
        payload.user = newUser[0]._id;
        const newTeacher = yield teacher_model_1.Teacher.create([payload], { session });
        if (!newTeacher.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create Teacher");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newTeacher;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.UserService = {
    createStudentDB,
    createTeacherDB
};
