import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '@/services/gallery.service';

const QUERY_KEY = ['gallery'];

/* ================= QUERIES (GET) ================= */

// Get Public Gallery (Paginated)
export const useGallery = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEY, page],
    queryFn: () => galleryService.getAll(page),
    staleTime: 1000 * 60 * 5, // 5 minute cache
  });
};

/* ================= MUTATIONS (POST, PUT, DELETE) ================= */

// Upload Image
export const useUploadGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: File) => galleryService.upload(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

// Replace Image
export const useReplaceGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: number; image: File }) => 
      galleryService.replace(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

// Delete Image
export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => galleryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
