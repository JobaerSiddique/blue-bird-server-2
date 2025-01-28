import { Document, Schema, Types } from 'mongoose';

// Interface for a single student's attendance
interface IStudentAttendance {
  student: Types.ObjectId; // Reference to Student schema
  status: 'Present' | 'Absent' | 'Late' | 'Excused'; // Enum for attendance status
}

// Main Attendance interface
export interface IAttendance extends Document {
  date: Date; // Date of the attendance record
  class: Types.ObjectId; // Reference to Class schema
  subject: string; // Subject name
  teacher: Types.ObjectId; // Reference to Teacher schema
  attendance: IStudentAttendance[]; // List of student attendance records
}
