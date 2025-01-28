import express from 'express'
import { TeacherController } from './teacher.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router()

router.get('/',TeacherController.getAllTeacher)
router.get('/:id',TeacherController.singleTeacherInfo)
router.delete('/:id',auth(USER_ROLE.admin),TeacherController.deleteTeacher)


export const TeacherRoutes = router;