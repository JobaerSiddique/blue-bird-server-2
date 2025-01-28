import  jwt,{ JwtPayload } from 'jsonwebtoken';
import  httpStatus  from 'http-status';
import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import bcrypt from 'bcrypt'
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import { sendEmail } from '../../utilis/sendEmail';


const loginUserDB = async(identity:string,password:string)=>{
    const isEmail = identity.includes('@')
    const query = isEmail ? { email: identity } : { id: identity };

    const user = await User.findOne(query).select("+password");
    
    if(!user){
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }
    if(user.isDeleted){
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been deleted");
    }
    if(user.status === "Blocked"){
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }
    const JwtPayload={
        userId:user._id,

        role:user.role
    }

    const accessToken = createToken(JwtPayload,
        config.ACCESS_TOKEN as string,
        config.ACCESS_TOKEN_EXPIRE as string)
   
   
        const refreshToken = createToken(JwtPayload,
        config.REFRESH_TOKEN as string,
        config.REFRESH_TOKEN_EXPIRE as string)

        return{
            accessToken,
            refreshToken
        }
}
 


const forgetPasswordDB =async(identity:string)=>{
    console.log(identity);
    const isEmail = identity.includes('@')
    const query = isEmail ? { email: identity } : { id: identity };
    const user = await User.findOne(query).select("+password");
    console.log(user);
    
    if(!user){
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or ID");
    }
    if(user.isDeleted){
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been deleted");
    }
    if(user.status === "Blocked"){
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
    }
    
    const JwtPayload={
        userId:user.id,

        role:user.role
    }

    const resetToken = createToken(JwtPayload,config.ACCESS_TOKEN as string,'10m')
    const resetLink = `localhost:3000/resetPassword?id=${user.id}&token=${resetToken}`
    sendEmail(user.email,resetLink)
}

const resetPasswordDB = async(payload:{ identity:string,password:string},token:string)=>{
    const { identity, password } = payload;

    // Determine if the identity is email or ID
    const isEmail = identity.includes('@');
    const query = isEmail ? { email: identity } : { id: identity };
  
    // Fetch the user from the database
    const user = await User.findOne(query).select('+password');
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or ID');
    }
  
    // Check if the user's account is active
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
    }
  
    if (user.status === 'Blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account has been blocked');
    }
  
    // Verify the token
    const decoded = jwt.verify(token, config.ACCESS_TOKEN as string) as JwtPayload;
  
    if (!decoded || identity !== decoded.userId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
    }

    const newPassword = await bcrypt.hash(password,Number(config.SALT))
    
    await User.findOneAndUpdate({
        id:decoded.userId,
        role:decoded.role
    },
    {password:newPassword}

)
}

export const AuthService = {
    loginUserDB,
    forgetPasswordDB,
    resetPasswordDB
}