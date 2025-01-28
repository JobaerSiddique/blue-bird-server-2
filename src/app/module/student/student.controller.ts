import  httpStatus  from 'http-status';
import catchAsync from "../../utilis/catchAsync";
import sendResponse from "../../utilis/sendResponse";
import { StudentService } from "./student.service";

const getAllStudent = catchAsync(async(req,res)=>{
    const result = await StudentService.getAllStudentDB(req.query)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student are retrieved succesfully',
        data:result
    })
});

const  getSingleStudent = catchAsync(async(req,res)=>{
    const {id} = req.params
    const result = await StudentService.getSingleStudentFromDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student retrieved succesfully',
        data:result
    })
})

const deleteStudent = catchAsync(async(req,res)=>{
    const {id}=req.params;
    const result = await StudentService.deleteStudentFromDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student deleted successfully',
        data:''
    })
})

export const StudentController = {
    getAllStudent,
    getSingleStudent,
    deleteStudent
}