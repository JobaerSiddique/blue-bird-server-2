
import express from 'express';
import { AttendanceController } from './attendance.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.post('/',auth(USER_ROLE.teacher),AttendanceController.createAttendacne)



export const AttendanceRoute =router;