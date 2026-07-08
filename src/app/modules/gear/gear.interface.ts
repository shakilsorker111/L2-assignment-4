import { GearItem } from "@prisma/client";

export type TCreateGear = Omit<
  GearItem,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "availableStock"
  | "isAvailable"
>;

export type TUpdateGear = Partial<TCreateGear>;