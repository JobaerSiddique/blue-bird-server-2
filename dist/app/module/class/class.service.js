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
exports.ClassService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const class_model_1 = require("./class.model");
const mongoose_1 = __importDefault(require("mongoose"));
const teacher_model_1 = require("../teacher/teacher.model");
const createClassDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const existClass = yield class_model_1.Class.findOne({
        name: payload.name,
        section: payload.section,
        shift: payload.shift
    });
    if (existClass) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "A class with this name, section, and shift already exists.");
    }
    const newClass = yield class_model_1.Class.create(payload);
    return newClass;
});
const assignClassTeacherToDB = (classId, teacherId, subject) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Fetch the class
        const targetClass = yield class_model_1.Class.findById(classId).session(session);
        if (!targetClass) {
            throw new Error("Class not found");
        }
        // Check if the subject already exists in the class
        const existingSubject = targetClass.subjects.find((subj) => subj.name === subject);
        if (existingSubject) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This subject is already assigned to this class");
        }
        // Fetch the teacher
        const teacher = yield teacher_model_1.Teacher.findById(teacherId).session(session);
        if (!teacher) {
            throw new Error("Teacher not found");
        }
        // Add the subject and assign the teacher to the class
        targetClass.subjects.push({
            name: subject,
            assignedTeacher: teacherId,
        });
        yield targetClass.save({ session });
        // Add the class to the teacher's assignedClasses if not already present
        if (!teacher.assignedClasses.includes(classId)) {
            teacher.assignedClasses.push(classId);
        }
        yield teacher.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return targetClass;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
    }
});
exports.ClassService = {
    createClassDB,
    assignClassTeacherToDB
};
