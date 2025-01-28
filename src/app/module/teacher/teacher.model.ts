import { model, Schema } from "mongoose";
import { ITeacher } from "./teacher.interface";

const TeacherNameSchema = new Schema({
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
      maxlength: [20, 'Name can not be more than 20 characters'],
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last Name is required'],
      maxlength: [20, 'Name can not be more than 20 characters'],
    },
  });

  const teacherSchema = new Schema<ITeacher>(
    {
      teacherId: {
        type: String,
        required: [true, "Teacher ID is required"],
        unique: true,
        index: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
      },
      name: {
        type: TeacherNameSchema,
        required: [true, "Name is required"],
      },
      gender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: "{VALUE} is not a valid gender",
        },
        required: [true, "Gender is required"],
      },
      dateOfBirth: {
        type: Date,
        
      },
      contactNo: {
        type: String,
        required: [true, "Contact number is required"],
      },
      bloodGroup: {
        type: String,
        enum: {
          values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          message: "{VALUE} is not a valid blood group",
        },
      },
      expertiseSubjects: {
        type: [String], // Array of strings to hold multiple subjects
        required: [true, "Expertise in subjects is required"],
      },
      qualification: {
        type: String,
        required: [true, "Qualification is required"],
      },
      assignedClasses: [
        {
          type: Schema.Types.ObjectId,
          ref: "Class", // Reference to the Class model
          
        },
      ],
      profileImg: {
        type: String,
      
      },
      joiningYear:{
        type: String,
        required: [true, 'Joining Year is required']
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt timestamps
      toJSON: {
        virtuals: true, // Enables virtual fields to be included in JSON output
      },
    }
  );
  teacherSchema.virtual('fullName').get(function () {
    let fullName = '';
    if (this.name?.firstName) {
      fullName += this.name.firstName;
    }
    if (this.name?.middleName) {
      fullName += ' ' + this.name.middleName;
    }
    if (this.name?.lastName) {
      fullName += ' ' + this.name.lastName;
    }
    return fullName.trim(); // Remove leading/trailing spaces
  });

  export const Teacher = model<ITeacher>('Teacher',teacherSchema)