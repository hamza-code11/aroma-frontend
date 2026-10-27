import axiosInstance from '@/lib/axios';
import type { Product, ProductPayload } from '@/types/product';

// Payload ko FormData mein convert karta hai (booleans => 1/0)
const buildFormData = (payload: Partial<ProductPayload>, method?: 'PUT'): FormData => {
  const formData = new FormData();

  if (method) formData.append('_method', method);

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'main_image' || key === 'images') return;
    if (value === null || value === undefined) return;

    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
    } else {
      formData.append(key, String(value));
    }
  });

  if (payload.main_image) {
    formData.append('main_image', payload.main_image);
  }

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image) => {
      formData.append('images[]', image);
    });
  }

  return formData;
};

export const productService = {
  // Get All Products (Cached)
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products');
    return response.data.data;
  },

  // Get Single Product
  getOne: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.data;
  },

  // Create Product (With Images)
  create: async (payload: ProductPayload): Promise<Product> => {
    const response = await axiosInstance.post('/admin/products', buildFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  // Update Product (_method=PUT spoofing)
  update: async (id: number, payload: Partial<ProductPayload>): Promise<Product> => {
    const response = await axiosInstance.post(
      `/admin/products/${id}`,
      buildFormData(payload, 'PUT'),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },

  // Delete Product
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/products/${id}`);
  },

  // Toggle Status
  toggleStatus: async (id: number): Promise<Product> => {
    const response = await axiosInstance.patch(`/admin/products/${id}/toggle-status`);
    return response.data.data;
  },
};