import mongoose, { Schema } from 'mongoose';
import { IAttendance } from './attendance.interface';


// Helper function for Bangladesh local time
function getBangladeshTime(): Date {
  const now = new Date();
  const offset = 6 * 60 * 60 * 1000; // UTC+6 in milliseconds
  return new Date(now.getTime() + offset);
}

const attendanceSchema = new Schema<IAttendance>({
  date: {
    type: Date,
    required: true,
    default: getBangladeshTime,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  attendance: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
      },
      status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        required: true,
      },
    },
  ],
});

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
