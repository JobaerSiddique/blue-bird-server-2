import { USER_ROLE } from "./user.constants";

export interface IUser {
    id: string;
   
    email: string; // Required and unique
    password: string; // Required, minimum length of 6
    role:"Student" | "Teacher" | "Admin" | "SuperAdmin";
    profileImg?: string; // Optional
    isDeleted: boolean; 
    status:"Active" | "Blocked"
  }

  export type TUserRole = keyof typeof USER_ROLE;