export interface CreateCheckoutPayload {
  rentalOrderId: string;
}

export interface PaymentQuery {
  page?: string;
  limit?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}