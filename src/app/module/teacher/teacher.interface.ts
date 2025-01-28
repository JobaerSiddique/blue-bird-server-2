import { ObjectId, Types } from "mongoose";
export type TTeacherName = {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  
export interface ITeacher {
  teacherId: string; // Unique Teacher ID
  user: Types.ObjectId;
  name: TTeacherName; // Full name of the teacher
  email:string;
  gender: "male" | "female" | "other"; // Gender of the teacher
  dateOfBirth: Date; // Date of Birth
  contactNo: string; // Primary contact number
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"; // Optional blood group
  expertiseSubjects: string[]; // Array of subjects the teacher is specialized in
  qualification: string; // Teacher's qualifications
  assignedClasses: ObjectId[]; // Array of Class IDs the teacher is assigned to
  profileImg?: string; // Optional profile image URL
  joiningYear:string;
  isDeleted: boolean; // Soft deletion flag
  createdAt?: Date; // Timestamp for record creation (optional)
  updatedAt?: Date; // Timestamp for last update (optional)
}
