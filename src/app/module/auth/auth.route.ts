import express from 'express'
import { AuthController } from './auth.controller';

const router = express.Router()

router.post('/login',AuthController.loginUser)
router.post('/forgetPassword',AuthController.forgetPassword)
router.post('/resetPassword',AuthController.resetPassword)




export const AuthRoute = router;