"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRoutes = void 0;
const express_1 = __importDefault(require("express"));
const class_controller_1 = require("./class.controller");
const router = express_1.default.Router();
router.post('/create-class', class_controller_1.ClassController.createClass);
router.put('/assign-class/:id', class_controller_1.ClassController.assignClassTeacher);
exports.ClassRoutes = router;
