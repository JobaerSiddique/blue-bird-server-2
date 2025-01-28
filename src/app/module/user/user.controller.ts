import  httpStatus  from 'http-status';
import catchAsync from "../../utilis/catchAsync";
import sendResponse from "../../utilis/sendResponse";
import { UserService } from "./user.service";



const createStudent = catchAsync(async(req,res)=>{
    const {password,student:studentData} = req.body
 
    const result = await UserService.createStudentDB(password,studentData);
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Student Created successfully",
        data:result
    })
})

const createTeacher = catchAsync(async(req,res)=>{
    const {password,teacher:teacherData} = req.body
    console.log({teacherData});
    
    const result = await UserService.createTeacherDB(password,teacherData);
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Teacher Created successfully",
        data:result
    })
})
export const UserController = {
    createStudent,
    createTeacher
}