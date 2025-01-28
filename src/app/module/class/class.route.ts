import express from 'express';
import { ClassController } from './class.controller';

const router = express.Router();

router.post('/create-class',ClassController.createClass);
router.put('/assign-class/:id',ClassController.assignClassTeacher)




export const ClassRoutes = router;