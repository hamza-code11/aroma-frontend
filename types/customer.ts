export type CustomerRole = "admin" | "user";

export interface Customer {
  id: number;
  name: string;
  email: string;
  role: CustomerRole;
  created_at: string;
}
