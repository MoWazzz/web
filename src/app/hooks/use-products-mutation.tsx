import { useMutation, useQueryClient } from "@tanstack/react-query";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
};

const API_URL = "https://fakestoreapi.com/products";
const PRODUCTS_KEY = ["products"] as const;

function useProductMutation<TVariables>(
  mutationFn: (vars: TVariables) => Promise<Product>,
  onMutateCallback?: (vars: TVariables, prev: Product[] | undefined) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_KEY);
      onMutateCallback?.(variables, previousProducts);
      return { previousProducts };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
    onError: (err, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_KEY, context.previousProducts);
      }
      console.error("Product mutation failed:", err);
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useProductMutation(
    async (newProduct: Omit<Product, "id">) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    (newProduct, previousProducts) => {
      if (previousProducts) {
        const optimisticProduct: Product = {
          id: Math.max(...previousProducts.map((p) => p.id), 0) + 1,
          ...newProduct,
        };
        queryClient.setQueryData(PRODUCTS_KEY, [...previousProducts, optimisticProduct]);
      }
    }
  );
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useProductMutation(
    async ({ id, ...updates }: Partial<Product> & { id: number }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    ({ id, ...updates }, previousProducts) => {
      if (previousProducts) {
        queryClient.setQueryData(
          PRODUCTS_KEY,
          previousProducts.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      }
    }
  );
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useProductMutation(
    async (id: number) => {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    (id, previousProducts) => {
      if (previousProducts) {
        queryClient.setQueryData(
          PRODUCTS_KEY,
          previousProducts.filter((p) => p.id !== id)
        );
      }
    }
  );
}
