//api products.tsx
import { useQuery } from "@tanstack/react-query";   
// Function to fetch products data
export async function getProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    return res.json();
}
// Hook to use products data
export function useProductsData() {
    return useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });
}