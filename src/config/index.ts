import dotenv from "dotenv";
import path from "path";



dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    port: process.env.port || 5000,
    database_url: process.env.DATABASE_URL,
    jwt_access_secret: process.env.JWT_SECRET,
}