"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherValidationzod = exports.TeacherSchema = void 0;
const zod_1 = require("zod");
// Schema for TeacherName
const TeacherNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .max(20, "First name cannot exceed 20 characters")
        .min(1, "First name is required"),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .max(20, "Last name cannot exceed 20 characters")
        .min(1, "Last name is required"),
});
// Schema for Teacher
exports.TeacherSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().trim().optional(),
        teacher: zod_1.z.object({
            teacherId: zod_1.z
                .string()
                .min(1, "Teacher ID is required")
                .max(50, "Teacher ID cannot exceed 50 characters"),
            name: TeacherNameSchema,
            email: zod_1.z.string().email("Invalid email address"),
            gender: zod_1.z.enum(["male", "female", "other"], {
                errorMap: () => ({
                    message: "Invalid gender; choose between 'male', 'female', or 'other'",
                }),
            }),
            dateOfBirth: zod_1.z.preprocess((value) => {
                if (typeof value === "string" || value instanceof String) {
                    return new Date(value);
                }
                return value;
            }, zod_1.z.date()),
            contactNo: zod_1.z
                .string()
                .min(11, "Contact number must be at least 11 digits")
                .max(11, "Contact number cannot exceed 11 digits"),
            bloodGroup: zod_1.z
                .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
                .optional(),
            expertiseSubjects: zod_1.z
                .array(zod_1.z.string())
                .min(1, "At least one expertise subject is required"),
            qualification: zod_1.z.string().min(1, "Qualification is required"),
            assignedClasses: zod_1.z
                .array(zod_1.z.string())
                .optional(), // Using string for ObjectId compatibility
            profileImg: zod_1.z.string().url("Invalid profile image URL").optional(),
            joiningYear: zod_1.z
                .string()
                .regex(/^\d{4}$/, "Joining Year must be a valid 4-digit year"),
            isDeleted: zod_1.z.boolean().optional(),
            createdAt: zod_1.z.date().optional(),
            updatedAt: zod_1.z.date().optional(),
        })
    })
});
exports.TeacherValidationzod = {
    TeacherSchema: exports.TeacherSchema
};
