'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useUIStore } from './store/UIStore';

type Product = { id: number; name: string };

export default function HomePage() {
  const queryClient = useQueryClient();
  const { theme, toggleTheme, cart, addToCart } = useUIStore();

  const productsQuery = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
    retry: 5, // offline retry demo
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // exponential backoff
    staleTime: 30000,
  });

  const addProductMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({ id: Date.now(), name }),
      });
      return res.json();
    },

    // ✅ Optimistic update
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const prev = queryClient.getQueryData<Product[]>(['products']);

      queryClient.setQueryData<Product[]>(['products'], (old) => [
        ...(old || []),
        { id: Date.now(), name },
      ]);

      return { prev };
    },

    onError: (_err, _new, ctx) => {
      queryClient.setQueryData(['products'], ctx?.prev);
    },

    // ✅ Query invalidation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-2xl">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
            Products Demo
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Week 4: Server Data + Client Store 
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => productsQuery.refetch()}
            disabled={productsQuery.isFetching}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {productsQuery.isFetching ? 'Refreshing...' : 'Refresh Products'}
          </button>

          <button
            onClick={toggleTheme}
            className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
          >
            🌓 {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>

        {/* Status Section */}
        {productsQuery.isLoading && !productsQuery.data && (
          <div className="mb-4 rounded bg-blue-100 p-3 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
            Loading products...
          </div>
        )}

        {productsQuery.isFetching && productsQuery.data && (
          <div className="mb-4 rounded bg-yellow-100 p-3 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100">
            ⟳ Syncing data (offline retry demo: 5 retries with exponential backoff)
          </div>
        )}

        {productsQuery.isError && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-100">
            Error: {String((productsQuery.error as Error).message)}
          </div>
        )}

        {/* Products List Section */}
        {productsQuery.data && (
          <div className="mb-6 rounded-md border border-gray-300 p-4 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Available Products ({productsQuery.data.length})
            </h2>
            <ul className="space-y-2">
              {productsQuery.data.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-900"
                >
                  <span className="text-black dark:text-white">{p.name}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    🛒 Add to cart
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => addProductMutation.mutate('New Product')}
              disabled={addProductMutation.isPending}
              className="mt-4 rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {addProductMutation.isPending ? 'Adding...' : '✚ Add product (optimistic)'}
            </button>
          </div>
        )}

        {/* UI Store State Section */}
        <div className="rounded-md border border-gray-300 p-4 dark:border-gray-700">
          <h2 className="mb-3 text-lg font-semibold text-black dark:text-white">
            Zustand UI Store State
          </h2>

          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme: <span className="font-bold">{theme}</span>
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Cart Items ({cart.length}):
            </p>
            {cart.length > 0 ? (
              <ul className="space-y-1">
                {cart.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    • {item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Cart is empty
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
