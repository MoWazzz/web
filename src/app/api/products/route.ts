import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    products: [
      { id: 1, name: "Muhammed" },
      { id: 2, name: "Product B" },
      { id: 3, name: "Product C" },
      { id: 4, name: "Product D" },
    ],
  });
}