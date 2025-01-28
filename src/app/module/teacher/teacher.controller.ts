import  httpStatus  from 'http-status';
import catchAsync from "../../utilis/catchAsync";
import sendResponse from "../../utilis/sendResponse";
import { TeacherService } from "./teacher.service";


const getAllTeacher = catchAsync(async(req,res)=>{
    const result = await TeacherService.getAllTeacherDB(req.query)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Teachers are retrieved succesfully',
        data:result
    })
})

const singleTeacherInfo = catchAsync(async(req,res)=>{
    const {id }= req.params
    const result = await TeacherService.singleTeacherfromDB(id)
    console.log(result);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Teacher retrieved succesfully',
        data:result
    })
})


const deleteTeacher = catchAsync(async(req,res)=>{
    const {id} = req.params
    const result = await TeacherService.deleteTeacherFromDB(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Teacher deleted successfully',
        data:result
    })
})

export const TeacherController = {
    getAllTeacher,
    singleTeacherInfo,
    deleteTeacher
}