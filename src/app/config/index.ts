import dotenv from "dotenv";
import path from "path";



dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
}