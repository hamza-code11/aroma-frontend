export type WeightUnit = "lb" | "kg" | "g" | "oz";
export type DimensionUnit = "in" | "cm" | "mm";

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  weight: number;
  weight_unit: WeightUnit;
  length: number | null;
  width: number | null;
  height: number | null;
  dimension_unit: DimensionUnit;
  shipping_class: string | null;
  images: string[];
  main_image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Backend with('category:id,name') ki wajah se aata hai
  category?: {
    id: number;
    name: string;
  };
}

// Form submit ke liye payload type (FormData banane ke liye)
export interface ProductPayload {
  category_id: number;
  name: string;
  sku: string;
  description: string;
  regular_price: number;
  sale_price?: number | null;
  stock_quantity: number;
  weight: number;
  weight_unit: WeightUnit;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimension_unit: DimensionUnit;
  shipping_class?: string | null;
  is_active: boolean;
  main_image?: File | null;
  images?: File[] | null;
}