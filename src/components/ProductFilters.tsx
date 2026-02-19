"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  productCount: number;
}

export default function ProductFilters({
  categories,
  productCount,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lowStock = searchParams.get("lowStock") === "true";
  const categoryId = searchParams.get("category") || "";

  const updateFilters = (newLowStock: boolean, newCategoryId: string) => {
    const params = new URLSearchParams();

    if (newLowStock) {
      params.set("lowStock", "true");
    }

    if (newCategoryId) {
      params.set("category", newCategoryId);
    }

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const handleLowStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters(e.target.checked, categoryId);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters(lowStock, e.target.value);
  };

  return (
    <div className="mb-6 flex gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <select
          className="border rounded-lg px-3 py-2 bg-white"
          value={categoryId}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={handleLowStockChange}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Show low stock only</span>
        </label>
      </div>

      <div className="text-sm text-gray-500">
        {productCount} {productCount === 1 ? "product" : "products"}
      </div>
    </div>
  );
}
