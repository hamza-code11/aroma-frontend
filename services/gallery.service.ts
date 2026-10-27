import axiosInstance from '@/lib/axios';
import type { GalleryImage, PaginatedGalleryResponse } from '@/types/gallery';

// FormData banane ka helper
const buildImageFormData = (image: File, method?: 'PUT'): FormData => {
  const formData = new FormData();
  if (method) formData.append('_method', method);
  formData.append('image', image);
  return formData;
};

export const galleryService = {
  // Public: Get all gallery images
  getAll: async (page: number = 1): Promise<PaginatedGalleryResponse> => {
    const response = await axiosInstance.get(`/gallery?page=${page}`);
    return response.data.data;
  },

  // Admin: Upload new image
  upload: async (image: File): Promise<GalleryImage> => {
    const response = await axiosInstance.post('/admin/gallery', buildImageFormData(image), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  // Admin: Replace existing image
  replace: async (id: number, image: File): Promise<GalleryImage> => {
    const response = await axiosInstance.post(
      `/admin/gallery/${id}`,
      buildImageFormData(image, 'PUT'),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },

  // Admin: Delete image
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/gallery/${id}`);
  },
};
