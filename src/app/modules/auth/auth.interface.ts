export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "PROVIDER";
}