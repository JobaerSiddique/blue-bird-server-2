"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const mongoose_1 = require("mongoose");
const subjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Subject name is required"],
        trim: true,
    },
    assignedTeacher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Teacher",
        required: [true, "Each subject must have an assigned teacher"],
    },
}, {
    _id: false, // Prevents a new `_id` field for each subject
});
const classSchema = new mongoose_1.Schema({
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
exports.Class = (0, mongoose_1.model)("Class", classSchema);
