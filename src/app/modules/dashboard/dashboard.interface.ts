export interface DashboardStats {
  total: number;
}

export interface RevenueStats {
  totalRevenue: number;
}

export interface DashboardQuery {
  from?: string;
  to?: string;

  month?: string;
  year?: string;

  page?: string;
  limit?: string;
}