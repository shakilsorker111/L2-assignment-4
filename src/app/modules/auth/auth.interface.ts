export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "PROVIDER";
};