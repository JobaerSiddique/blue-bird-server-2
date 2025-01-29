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
exports.TeacherService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const teacher_constant_1 = require("./teacher.constant");
const teacher_model_1 = require("./teacher.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const getAllTeacherDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherQuery = new QueryBuilder_1.default(teacher_model_1.Teacher.find()
        .populate('user')
        .populate('assignedClasses'), query)
        .search(teacher_constant_1.teacherSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield teacherQuery.countTotal();
    const result = yield teacherQuery.modelQuery;
    return {
        result,
        meta
    };
});
const singleTeacherfromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = yield teacher_model_1.Teacher.findById(id);
    if (!teacher) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Teacher not found");
    }
    if (teacher.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Teacher has been deleted");
    }
    return teacher;
});
const deleteTeacherFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const teacher = yield teacher_model_1.Teacher.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!teacher) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete Teacher");
        }
        const userIds = teacher === null || teacher === void 0 ? void 0 : teacher.user;
        const user = yield user_model_1.User.findByIdAndUpdate({ _id: userIds }, { isDeleted: true }, { new: true, session });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete User");
        }
        // Commit the transaction if both operations succeed
        yield session.commitTransaction();
        yield session.endSession();
        return teacher;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
});
exports.TeacherService = {
    getAllTeacherDB,
    singleTeacherfromDB,
    deleteTeacherFromDB
};
