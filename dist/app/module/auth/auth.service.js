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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const sendEmail_1 = require("../../utilis/sendEmail");
const loginUserDB = (identity, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmail = identity.includes('@');
    const query = isEmail ? { email: identity } : { id: identity };
    const user = yield user_model_1.User.findOne(query).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid email or password");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account has been deleted");
    }
    if (user.status === "Blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account has been blocked");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid email or password");
    }
    const JwtPayload = {
        userId: user._id,
        role: user.role
    };
    const accessToken = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.ACCESS_TOKEN, config_1.default.ACCESS_TOKEN_EXPIRE);
    const refreshToken = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.REFRESH_TOKEN, config_1.default.REFRESH_TOKEN_EXPIRE);
    return {
        accessToken,
        refreshToken
    };
});
const forgetPasswordDB = (identity) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(identity);
    const isEmail = identity.includes('@');
    const query = isEmail ? { email: identity } : { id: identity };
    const user = yield user_model_1.User.findOne(query).select("+password");
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid email or ID");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account has been deleted");
    }
    if (user.status === "Blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account has been blocked");
    }
    const JwtPayload = {
        userId: user.id,
        role: user.role
    };
    const resetToken = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.ACCESS_TOKEN, '10m');
    const resetLink = `localhost:3000/resetPassword?id=${user.id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)(user.email, resetLink);
});
const resetPasswordDB = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { identity, password } = payload;
    // Determine if the identity is email or ID
    const isEmail = identity.includes('@');
    const query = isEmail ? { email: identity } : { id: identity };
    // Fetch the user from the database
    const user = yield user_model_1.User.findOne(query).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or ID');
    }
    // Check if the user's account is active
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Your account has been deleted');
    }
    if (user.status === 'Blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Your account has been blocked');
    }
    // Verify the token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_TOKEN);
    if (!decoded || identity !== decoded.userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden');
    }
    const newPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.SALT));
    yield user_model_1.User.findOneAndUpdate({
        id: decoded.userId,
        role: decoded.role
    }, { password: newPassword });
});
exports.AuthService = {
    loginUserDB,
    forgetPasswordDB,
    resetPasswordDB
};
