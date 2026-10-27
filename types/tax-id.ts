export interface TaxId {
  id: number;
  user_id: number;
  tax_id: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TaxIdPayload {
  tax_id: string;
}
