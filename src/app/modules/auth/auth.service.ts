import bcrypt from "bcrypt";
import { TRegisterUser } from "./auth.interface";
import config from "../../config";
import prisma from "../../config/prisma";

import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";

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

export const AuthService = {
  registerUser,
};