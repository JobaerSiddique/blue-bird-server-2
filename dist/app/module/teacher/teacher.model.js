"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const mongoose_1 = require("mongoose");
const TeacherNameSchema = new mongoose_1.Schema({
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
const teacherSchema = new mongoose_1.Schema({
    teacherId: {
        type: String,
        required: [true, "Teacher ID is required"],
        unique: true,
        index: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Class", // Reference to the Class model
        },
    ],
    profileImg: {
        type: String,
    },
    joiningYear: {
        type: String,
        required: [true, 'Joining Year is required']
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    toJSON: {
        virtuals: true, // Enables virtual fields to be included in JSON output
    },
});
teacherSchema.virtual('fullName').get(function () {
    var _a, _b, _c;
    let fullName = '';
    if ((_a = this.name) === null || _a === void 0 ? void 0 : _a.firstName) {
        fullName += this.name.firstName;
    }
    if ((_b = this.name) === null || _b === void 0 ? void 0 : _b.middleName) {
        fullName += ' ' + this.name.middleName;
    }
    if ((_c = this.name) === null || _c === void 0 ? void 0 : _c.lastName) {
        fullName += ' ' + this.name.lastName;
    }
    return fullName.trim(); // Remove leading/trailing spaces
});
exports.Teacher = (0, mongoose_1.model)('Teacher', teacherSchema);
