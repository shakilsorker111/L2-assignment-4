import bcrypt from "bcrypt";
import { TRegisterUser } from "./auth.interface";
import config from "../../config";
import prisma from "../../config/prisma";

import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { generateToken } from "../../utils/jwt";



const registerUser = async (payload: TRegisterUser) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(
    409,
    "User already exists"
);
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      avatar: payload.avatar,
      role: payload.role,
    },
  });

  return user;
};


const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};