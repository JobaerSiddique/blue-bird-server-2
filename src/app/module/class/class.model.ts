import mongoose, { model, Schema } from "mongoose";
import { IClass, ISubject } from "./class.interface";

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    assignedTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Each subject must have an assigned teacher"],
    },
  },
  {
    _id: false, // Prevents a new `_id` field for each subject
  }
);
const classSchema = new Schema<IClass>({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C'], // Allowed values for section
  },
  shift: {
    type: String,
    required: true,
    enum: ['Morning', 'Day', 'Evening'], // Allowed values for shift
  },
  group: {
    type: String,
    enum: ['Science', 'Commerce', 'Arts'], // Allowed values for group
  },
  subjects: [
    {
      type: subjectSchema,
     
    },
  ],
});

// Unique index on name, shift, and section
classSchema.index({ name: 1, shift: 1, section: 1 }, { unique: true });

export const Class = model<IClass>("Class", classSchema);
