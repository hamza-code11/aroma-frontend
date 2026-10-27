export interface Customer {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface PaginatedCustomerResponse {
  current_page: number;
  data: Customer[];
  total: number;
  per_page: number;
  last_page: number;
}
