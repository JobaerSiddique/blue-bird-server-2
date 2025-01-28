import  httpStatus  from 'http-status';
import catchAsync from "../../utilis/catchAsync";
import sendResponse from "../../utilis/sendResponse";
import { AuthService } from "./auth.service";
import AppError from '../../error/AppError';



const loginUser = catchAsync(async(req,res)=>{
    const {identity,password} = req.body
    const result = await AuthService.loginUserDB(identity,password)
    const {accessToken,refreshToken} = result

    res.cookie('refreshToken',refreshToken)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"User logged in successfully",
        data:accessToken
    })
    
})



const forgetPassword= catchAsync(async(req,res)=>{
    const {identity}= req.body
    const result = await AuthService.forgetPasswordDB(identity)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password reset link sent successfully",
        data:''
 
    })
})

const resetPassword= catchAsync(async(req,res)=>{
    const token = req.headers.authorization
  const { identity, password } = req.body;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required');
  }

  if (!identity || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Identity and password are required');
  }

  const result = await AuthService.resetPasswordDB({ identity, password }, token);

  sendResponse(res,{
    statusCode:200,
    success:true,
    message:"Password reset successfully",
    data:''
  })
})

export const AuthController = {
    loginUser,
    forgetPassword,
    resetPassword
}