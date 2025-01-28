import { z } from "zod";

// Schema for TeacherName
const TeacherNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, "First name cannot exceed 20 characters")
    .min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .max(20, "Last name cannot exceed 20 characters")
    .min(1, "Last name is required"),
});

// Schema for Teacher
export const TeacherSchema = z.object({
  body:z.object({
    password: z.string().trim().optional(),
    teacher:z.object({
        teacherId: z
    .string()
    .min(1, "Teacher ID is required")
    .max(50, "Teacher ID cannot exceed 50 characters"),
  name: TeacherNameSchema,
  email: z.string().email("Invalid email address"),
 
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({
      message: "Invalid gender; choose between 'male', 'female', or 'other'",
    }),
  }),
  dateOfBirth: z.preprocess((value) => {
    if (typeof value === "string" || value instanceof String) {
        return new Date(value);
    }
    return value;
}, z.date()),
  contactNo: z
    .string()
    .min(11, "Contact number must be at least 11 digits")
    .max(11, "Contact number cannot exceed 11 digits"),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  expertiseSubjects: z
    .array(z.string())
    .min(1, "At least one expertise subject is required"),
  qualification: z.string().min(1, "Qualification is required"),
  assignedClasses: z
    .array(z.string())
    .optional(), // Using string for ObjectId compatibility
  profileImg: z.string().url("Invalid profile image URL").optional(),
  joiningYear: z
    .string()
    .regex(/^\d{4}$/, "Joining Year must be a valid 4-digit year"),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
    })
  })
});


export const TeacherValidationzod = {
    TeacherSchema
}