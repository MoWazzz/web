/* eslint-disable @typescript-eslint/no-explicit-any */
async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store", // important during dev
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage() {
  const data = await getProducts();

  return (
    <div>
      <h1>Products</h1>

      <ul>
        {data.products.map((product: any) => (
          <li key={product.id}>
            {product.name} – R{product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
