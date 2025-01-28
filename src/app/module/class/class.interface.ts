import mongoose, { Types } from "mongoose";

export interface ISubject {
  name: string;
  assignedTeacher: Types.ObjectId; // Reference to Teacher schema
}

export interface IClass {
  name: string;
  section: "A" | "B" | "C"; // Restrict to allowed values
  shift: "Morning" | "Day" | "Evening"; // Restrict to allowed values
  group?: "Science" | "Commerce" | "Arts"; // Optional field with allowed values
  subjects?: ISubject[]; // Array of subjects
}