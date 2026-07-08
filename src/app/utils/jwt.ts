import jwt, { Secret, SignOptions } from "jsonwebtoken";
import config from "../config";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwt_secret as Secret, {
    expiresIn: config.jwt_expires_in as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret as Secret);
};