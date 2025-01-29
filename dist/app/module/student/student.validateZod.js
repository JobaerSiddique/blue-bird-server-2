"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentValidation = void 0;
const zod_1 = require("zod");
// User Name Schema
const userNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .max(20, "Name can not be more than 20 characters")
        .nonempty("First Name is required"),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .max(20, "Name can not be more than 20 characters")
        .nonempty("Last Name is required"),
});
// Guardian Schema
const guardianSchema = zod_1.z.object({
    fatherName: zod_1.z.string().trim().nonempty("Father Name is required"),
    fatherOccupation: zod_1.z.string().trim().nonempty("Father occupation is required"),
    fatherContactNo: zod_1.z.string().nonempty("Father Contact No is required"),
    motherName: zod_1.z.string().nonempty("Mother Name is required"),
    motherOccupation: zod_1.z.string().nonempty("Mother occupation is required"),
    motherContactNo: zod_1.z.string().nonempty("Mother Contact No is required"),
});
// Local Guardian Schema
const localGuardianSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("Name is required"),
    occupation: zod_1.z.string().nonempty("Occupation is required"),
    contactNo: zod_1.z.string().nonempty("Contact number is required"),
    address: zod_1.z.string().nonempty("Address is required"),
});
// Student Schema
const studentSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20).optional(),
        student: zod_1.z.object({
            name: userNameSchema,
            gender: zod_1.z.enum(['male', 'female', 'other'], {
                errorMap: () => ({ message: 'Gender is not valid' }),
            }),
            dateOfBirth: zod_1.z.preprocess((value) => {
                if (typeof value === "string" || value instanceof String) {
                    return new Date(value);
                }
                return value;
            }, zod_1.z.date()),
            email: zod_1.z.string().email('Invalid email format').min(1, 'Email is required'),
            contactNo: zod_1.z.string().min(1, 'Contact number is required'),
            emergencyContactNo: zod_1.z.string().min(1, 'Emergency contact number is required'),
            bloogGroup: zod_1.z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: zod_1.z.string().min(1, 'Present address is required'),
            permanentAddress: zod_1.z.string().min(1, 'Permanent address is required'),
            guardian: guardianSchema,
            localGuardian: localGuardianSchema,
            profileImg: zod_1.z.string().default(''),
            class: zod_1.z.string().min(1, 'Class is required'), // Class ID as string
            admissionYear: zod_1.z.string().min(1, 'Admission Year is required'),
            isDeleted: zod_1.z.boolean().default(false),
        })
    })
});
const updateStudentSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20).optional(),
        student: zod_1.z.object({
            name: userNameSchema.optional(), // Make the name schema optional
            gender: zod_1.z.enum(['male', 'female', 'other'], {
                errorMap: () => ({ message: 'Gender is not valid' }),
            }).optional(),
            dateOfBirth: zod_1.z
                .preprocess((value) => {
                if (typeof value === "string" || value instanceof String) {
                    return new Date(value);
                }
                return value;
            }, zod_1.z.date())
                .optional(),
            email: zod_1.z.string().email('Invalid email format').optional(),
            contactNo: zod_1.z.string().optional(),
            emergencyContactNo: zod_1.z.string().optional(),
            bloogGroup: zod_1.z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: zod_1.z.string().optional(),
            permanentAddress: zod_1.z.string().optional(),
            guardian: guardianSchema.optional(),
            localGuardian: localGuardianSchema.optional(),
            profileImg: zod_1.z.string().optional(),
            class: zod_1.z.string().optional(), // Class ID as string
            admissionYear: zod_1.z.string().optional(),
            isDeleted: zod_1.z.boolean().optional(),
        }),
    }),
});
exports.studentValidation = {
    studentSchema,
    updateStudentSchema
};
