import  httpStatus  from 'http-status';
import AppError from "../../error/AppError"
import { IClass } from "./class.interface"
import { Class } from "./class.model"
import mongoose from 'mongoose';
import { Teacher } from '../teacher/teacher.model';


const createClassDB = async(payload:IClass)=>{
    console.log(payload);
    const existClass = await Class.findOne({
        name: payload.name,
        section: payload.section,
        shift: payload.shift
    })
    if(existClass){
        throw new AppError(httpStatus.FORBIDDEN,"A class with this name, section, and shift already exists.")
    }

    const newClass = await Class.create(payload)
    return newClass;
}


const assignClassTeacherToDB = async (classId: string, teacherId: string, subject: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Fetch the class
      const targetClass = await Class.findById(classId).session(session);
      if (!targetClass) {
        throw new Error("Class not found");
      }
  
      // Check if the subject already exists in the class
      const existingSubject = targetClass.subjects.find(
        (subj) => subj.name === subject
      );
      if (existingSubject) {
        throw new AppError
        (httpStatus.BAD_REQUEST,"This subject is already assigned to this class");
      }
  
      // Fetch the teacher
      const teacher = await Teacher.findById(teacherId).session(session);
      if (!teacher) {
        throw new Error("Teacher not found");
      }
  
      
  
      // Add the subject and assign the teacher to the class
      targetClass.subjects.push({
        name: subject,
        assignedTeacher: teacherId,
      });
      await targetClass.save({ session });
  
      // Add the class to the teacher's assignedClasses if not already present
      if (!teacher.assignedClasses.includes(classId)) {
        teacher.assignedClasses.push(classId);
      }
      await teacher.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      return targetClass
  
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "An error occurred"
      );
    }
  };
  
  
  


export const ClassService = {
    createClassDB,
    assignClassTeacherToDB
}