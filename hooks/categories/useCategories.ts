import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import type { CategoryPayload } from '@/types/category';
import { AxiosError } from 'axios';

// Query Key (Fast caching ke liye)
const QUERY_KEY = ['categories'];

/* ================= QUERIES (GET) ================= */

// Get All Categories Hook
export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minute tak data fresh rahega (Backend cache ke sath sync)
  });
};

// Get Single Category Hook
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => categoryService.getOne(id),
    enabled: !!id, // Jab tak ID na ho, call na kare
  });
};


/* ================= MUTATIONS (POST, PUT, DELETE) ================= */

// Create Category Hook
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoryService.create(payload),
    onSuccess: () => {
      // Data create hone par list ko refresh karein
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: AxiosError<any>) => {
      console.error("Create failed:", error.response?.data?.message);
    }
  });
};

// Update Category Hook
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryPayload }) => 
      categoryService.update(id, payload),
    onSuccess: (data, variables) => {
      // List refresh karein
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      // Single item ka cache bhi update karein
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
    },
  });
};

// Delete Category Hook
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};




// Toggle Status (Update Hook hi use hoga)
export const useToggleCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Ab humein id ke ilawa kuch bhejna hi nahi hai, backend khud status palat dega
    mutationFn: (id: number) => categoryService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
