import  httpStatus  from 'http-status';
import config from "../../config";
import AppError from "../../error/AppError";
import { Class } from "../class/class.model";
import { TStudent } from "../student/student.interface";
import { IUser } from "./user.interface";
import  bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import { generateStudentId } from '../student/student.utils';
import { User } from './user.model';
import { Student } from '../student/student.model';
import { ITeacher } from '../teacher/teacher.interface';
import { generateTeacherId } from '../teacher/teaacher.utils';
import { Teacher } from '../teacher/teacher.model';
const createStudentDB = async (password: string, payload: TStudent) => {
    const session = await mongoose.startSession();
  
    try {
      await session.startTransaction();
      
      const userData: Partial<IUser> = {};
      const newPassword = password || (config.DEFAULT_PASS as string);
  
      const saltRounds = Number(config.SALT);
      const hashPassword = await bcrypt.hash(newPassword, saltRounds);
  
      userData.password = hashPassword;
      userData.email = payload.email;
      userData.role = "Student";
  
      const foundClass = await Class.findById(payload.class);
      if (!foundClass) {
        
        throw new AppError(httpStatus.NOT_FOUND, 'Class Not Found');
      }
  
      const classId = new mongoose.Types.ObjectId(payload.class.toString());
      const studentId = await generateStudentId(payload.admissionYear, classId.toString() );
  
      userData.id = studentId;
  
      const newUser = await User.create([userData], { session });
      if (!newUser.length) {
        
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create User");
      }
  
      payload.studentId = newUser[0].id;
      payload.user = newUser[0]._id;
  
      const newStudent = await Student.create([payload], { session });
      if (!newStudent.length) {
       
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create Student");
      }
  
      await session.commitTransaction();
      await session.endSession();
  
      return newStudent;
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  };

  const createTeacherDB=async(password:string,payload:ITeacher)=>{
    

    const session = await mongoose.startSession()
    try {
      console.log("object",payload);
    const userData: Partial<IUser> = {};
    const newPassword = password || (config.TDEFAULT_PASS as string);

    const saltRounds = Number(config.SALT);
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    userData.password = hashPassword;
    userData.email = payload.email;
    userData.role = "Teacher";
      await session.startTransaction()
      const teacherId = await generateTeacherId(payload.joiningYear)
      console.log(teacherId);
      userData.id = teacherId
      const newUser = await User.create([userData], { session })
      if(!newUser.length) {
        
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create User")
      }
      payload.teacherId = newUser[0].id
      payload.user = newUser[0]._id

      const newTeacher = await Teacher.create([payload], { session })
      if(!newTeacher.length) {
        
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create Teacher")
      }
      await session.commitTransaction()
      await session.endSession()
      return newTeacher
    } catch (err:any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  }


export const UserService = {
    createStudentDB,
    createTeacherDB
}