import httpStatus  from 'http-status';
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { studentSearchableFields } from "./student.constants";
import { Student } from "./student.model"
import mongoose from 'mongoose';
import { User } from '../user/user.model';


const getAllStudentDB = async(query:Record<string,unknown>)=>{
    const studentQuery = new QueryBuilder(
        Student.find()
          .populate('user')
          .populate('class'),
          
        query,
      )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    
      const meta = await studentQuery.countTotal();
      const result = await studentQuery.modelQuery;
      return {
        result,
        meta
      }
}

const getSingleStudentFromDB = async(id:string)=>{
    const student = await Student.findById(id).populate('user');
    if(!student){
      throw new AppError(httpStatus.NOT_FOUND, "Student Not Found")
    }

    if(student.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST,"Student Already Deleted")
    }

    return student;
}

const deleteStudentFromDB = async(id:string)=>{
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const student = await Student.findByIdAndUpdate(id, {isDeleted:true}, {new:true}).session(session);
    if(!student){
      throw new AppError(httpStatus.NOT_FOUND, "Student Not Found")
    }

    const userId = student.user;

    const user = await User.findByIdAndUpdate(userId,{isDeleted:true}, {new:true,session});
    console.log(user);
    if(!user){
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete User")
    }
    await session.commitTransaction();
    await session.endSession();
    return student;
  } catch (error:any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error?.message)
  }
}

export const StudentService = {
    getAllStudentDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
}