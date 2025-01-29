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
exports.StudentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const student_constants_1 = require("./student.constants");
const student_model_1 = require("./student.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const getAllStudentDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const studentQuery = new QueryBuilder_1.default(student_model_1.Student.find()
        .populate('user')
        .populate('class'), query)
        .search(student_constants_1.studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield studentQuery.countTotal();
    const result = yield studentQuery.modelQuery;
    return {
        result,
        meta
    };
});
const getSingleStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findById(id).populate('user');
    if (!student) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Student Not Found");
    }
    if (student.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Student Already Deleted");
    }
    return student;
});
const deleteStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const student = yield student_model_1.Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).session(session);
        if (!student) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Student Not Found");
        }
        const userId = student.user;
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });
        console.log(user);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to Delete User");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return student;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
});
exports.StudentService = {
    getAllStudentDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
};
