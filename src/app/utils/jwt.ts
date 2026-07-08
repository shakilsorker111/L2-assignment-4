import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "../config";

export const generateToken = (
  payload: object,
  expiresIn?: string
) => {
  return jwt.sign(payload, config.jwt_secret as Secret, {
    expiresIn: (expiresIn || config.jwt_expires_in) as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    config.jwt_secret as Secret
  ) as JwtPayload;
};