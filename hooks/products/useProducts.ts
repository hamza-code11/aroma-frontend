import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { ProductPayload } from '@/types/product';
import { AxiosError } from 'axios';

const QUERY_KEY = ['products'];

/* ================= QUERIES (GET) ================= */

// Get All Products
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: productService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minute cache
  });
};

// Get Single Product
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => productService.getOne(id),
    enabled: !!id,
  });
};

/* ================= MUTATIONS (POST, PUT, DELETE) ================= */

// Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductPayload) => productService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

// Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductPayload> }) => 
      productService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
    },
  });
};

// Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

// Toggle Status
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
