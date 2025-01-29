"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    role: {
        type: String,
        enum: ["Student", "Teacher", "Admin", "SuperAdmin"]
    },
    profileImg: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Active", "Blocked"],
        default: "Active"
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true, // Include virtuals when converting to JSON
        transform: (doc, ret) => {
            // Transform the output to include formatted timestamps
            ret.createdAt = new Date(ret.createdAt).toLocaleString(); // Format createdAt
            ret.updatedAt = new Date(ret.updatedAt).toLocaleString(); // Format updatedAt
            delete ret.__v; // Remove version key
            return ret;
        },
    },
    toObject: {
        virtuals: true, // Include virtuals when converting to objects
    },
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
