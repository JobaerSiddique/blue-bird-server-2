import * as dotenv from 'dotenv'
dotenv.config()


export default{
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    DEFAULT_PASS: process.env.defaultPass,
    SALT: process.env.SALT,
    ACCESS_TOKEN:process.env.ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN,
    REFRESH_TOKEN_EXPIRE:process.env.REFRESH_TOKEN_EXPIRE,
    GUSER:process.env.gEmail,
    GPASS:process.env.gPass,
    NODE_ENV:process.env.NODE_ENV,
    TDEFAULT_PASS:process.env.TDEFAULT_PASS
}