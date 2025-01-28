import  httpStatus from 'http-status';
import catchAsync from "../../utilis/catchAsync";
import sendResponse from "../../utilis/sendResponse";
import { ClassService } from "./class.service";



const createClass = catchAsync(async(req,res)=>{
    const data = req.body
    const result = await ClassService.createClassDB(data);
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Class Created successfully",
        data:result
    })
})

const assignClassTeacher = catchAsync(async(req,res)=>{
   const {id:classId}=req.params;
    const {teacherId,subject} = req.body
    const result = await ClassService.assignClassTeacherToDB(classId,teacherId,subject)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Class teacher assigned successfully",
        data:result
    });
})


export const ClassController = {
    createClass,
    assignClassTeacher
}