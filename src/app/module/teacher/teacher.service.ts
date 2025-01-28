import  httpStatus  from 'http-status';
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../error/AppError";
import { teacherSearchableFields } from "./teacher.constant";
import { Teacher } from "./teacher.model"
import mongoose from 'mongoose';
import { User } from '../user/user.model';


const getAllTeacherDB = async(query:Record<string,unknown>)=>{
    const teacherQuery = new QueryBuilder(
        Teacher.find()
          .populate('user')
          .populate('assignedClasses'),
          query
    )
    .search(teacherSearchableFields)
            .filter()
            .sort()
            .paginate()
            .fields();
        
          const meta = await teacherQuery.countTotal();
          const result = await teacherQuery.modelQuery;
          return {
            result,
            meta
          }
}


const singleTeacherfromDB = async(id:string)=>{
    const teacher = await Teacher.findById(id);
    if(!teacher){
        throw new AppError(httpStatus.NOT_FOUND,"Teacher not found")
    }
    if(teacher.isDeleted){
      throw new AppError(httpStatus.FORBIDDEN,"Teacher has been deleted")
    }

    return teacher;
}

const deleteTeacherFromDB = async(id:string)=>{
  const session = await mongoose.startSession()  
  try {
    session.startTransaction()
    const teacher = await Teacher.findByIdAndUpdate(id,
      { isDeleted: true },
      { new: true, session } )
   
      if(!teacher){
        throw new AppError(httpStatus.BAD_REQUEST,"Failed to delete Teacher")
      }

      const userIds  = teacher?.user
    
    const user = await User.findByIdAndUpdate(
      {_id:userIds},
      {isDeleted: true},
      {new: true, session}
    )
    if(!user){
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,"Failed to delete User")
    }
   

    // Commit the transaction if both operations succeed
    await session.commitTransaction();
    await session.endSession();
    return teacher
  } catch (error:any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error?.message)
  }
}

export const TeacherService = {
    getAllTeacherDB,
    singleTeacherfromDB,
    deleteTeacherFromDB
}