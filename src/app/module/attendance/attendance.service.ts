import  httpStatus  from 'http-status';
import AppError from "../../error/AppError";
import { Class } from "../class/class.model"


const createAttendacneFromDB = async(classId:string,subject:string,teacherId:string)=>{
   
}


const getAllAttendance = async()=>{

}

export const AttadanceService={
    createAttendacneFromDB,
    getAllAttendance
}