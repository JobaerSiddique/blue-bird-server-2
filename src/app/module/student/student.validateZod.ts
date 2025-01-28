import { z } from "zod";

// User Name Schema
const userNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, "Name can not be more than 20 characters")
    .nonempty("First Name is required"),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .max(20, "Name can not be more than 20 characters")
    .nonempty("Last Name is required"),
});

// Guardian Schema
const guardianSchema = z.object({
  fatherName: z.string().trim().nonempty("Father Name is required"),
  fatherOccupation: z.string().trim().nonempty("Father occupation is required"),
  fatherContactNo: z.string().nonempty("Father Contact No is required"),
  motherName: z.string().nonempty("Mother Name is required"),
  motherOccupation: z.string().nonempty("Mother occupation is required"),
  motherContactNo: z.string().nonempty("Mother Contact No is required"),
});

// Local Guardian Schema
const localGuardianSchema = z.object({
  name: z.string().nonempty("Name is required"),
  occupation: z.string().nonempty("Occupation is required"),
  contactNo: z.string().nonempty("Contact number is required"),
  address: z.string().nonempty("Address is required"),
});

// Student Schema
const studentSchema = z.object({
  body:z.object({
    password:z.string().max(20).optional(),
    student:z.object({
     
 
        name: userNameSchema,
        gender: z.enum(['male', 'female', 'other'], {
          errorMap: () => ({ message: 'Gender is not valid' }),
        }),
        dateOfBirth: z.preprocess((value) => {
            if (typeof value === "string" || value instanceof String) {
                return new Date(value);
            }
            return value;
        }, z.date()),
        email: z.string().email('Invalid email format').min(1, 'Email is required'),
        contactNo: z.string().min(1, 'Contact number is required'),
        emergencyContactNo: z.string().min(1, 'Emergency contact number is required'),
        bloogGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
        presentAddress: z.string().min(1, 'Present address is required'),
        permanentAddress: z.string().min(1, 'Permanent address is required'),
        guardian: guardianSchema,
        localGuardian: localGuardianSchema,
        profileImg: z.string().default(''),
        class: z.string().min(1, 'Class is required'), // Class ID as string
        admissionYear: z.string().min(1, 'Admission Year is required'),
        isDeleted: z.boolean().default(false),
    })
  })
});



const updateStudentSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: userNameSchema.optional(), // Make the name schema optional
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender is not valid' }),
      }).optional(),
      dateOfBirth: z
        .preprocess((value) => {
          if (typeof value === "string" || value instanceof String) {
            return new Date(value);
          }
          return value;
        }, z.date())
        .optional(),
      email: z.string().email('Invalid email format').optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloogGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: guardianSchema.optional(),
      localGuardian: localGuardianSchema.optional(),
      profileImg: z.string().optional(),
      class: z.string().optional(), // Class ID as string
      admissionYear: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});



export const studentValidation ={
    studentSchema,
    updateStudentSchema
}
