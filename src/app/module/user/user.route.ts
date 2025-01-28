import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidation } from '../student/student.validateZod';
import {  TeacherValidationzod } from '../teacher/teacher.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';

const router = express.Router();

router.post('/create-student',validateRequest(studentValidation.studentSchema),UserController.createStudent)
router.post('/create-teacher',UserController.createTeacher)


export const UserRoutes = router;