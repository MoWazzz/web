"use client";

import { useQuery } from "@tanstack/react-query";

type Props = {
  initialData: unknown;
};

async function fetchProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default function HydratedData({ initialData }: Props) {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    staleTime: 30000,
  });

  return (
    <div className="w-full max-w-2xl rounded-md border p-4">
      <div className="mb-3 flex items-center justify-between">
        <strong>Week-2 API data</strong>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-2 text-sm text-red-600">
          Error: {String((error as Error).message)}
        </div>
      )}

      <pre className="text-sm leading-tight text-slate-700">
        {isLoading && !data ? "Loading..." : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
