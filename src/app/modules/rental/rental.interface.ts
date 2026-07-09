export interface CreateRentalPayload {
  gearItemId: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
}