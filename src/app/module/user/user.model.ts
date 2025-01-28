import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";



const UserSchema = new Schema<IUser>({
    id:{
        type:String,
        required:true,
      
    },
    email:{
        type:String,
        required:true,
        unique:true,
        
    },
    password:{
        type:String,
        required:true,
        select:0
    },
    role:{
        type:String,
        enum:["Student","Teacher","Admin","SuperAdmin"]
    },
    profileImg:{
        type:String,
        
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["Active","Blocked"],
        default:"Active"
    }
},{
    timestamps:true,
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
})


export const User = model<IUser>('User',UserSchema)