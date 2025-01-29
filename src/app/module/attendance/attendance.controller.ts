
import { AttadanceService } from './attendance.service';
import catchAsync from "../../utilis/catchAsync";



const createAttendacne = catchAsync(async(req,res)=>{
    const {classId,subject,attendance}=req.body;
    const teacherId = req.user.userId
    const result = await AttadanceService.createAttendacneFromDB(classId,subject,teacherId)
})

export const AttendanceController ={
    createAttendacne
}