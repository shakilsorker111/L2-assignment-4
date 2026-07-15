export interface CreateReviewPayload {
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewQuery {
  page?: string;
  limit?: string;
  sortOrder?: "asc" | "desc";
}