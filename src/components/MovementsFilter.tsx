"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface MovementsFilterProps {
  products: Product[];
  totalCount: number;
}

export default function MovementsFilter({
  products,
  totalCount,
}: MovementsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [productId, setProductId] = useState(
    searchParams.get("productId") || "",
  );
  const [type, setType] = useState(searchParams.get("type") || "");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [showAll, setShowAll] = useState(
    searchParams.get("showAll") === "true",
  );

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (productId) params.set("productId", productId);
    if (type) params.set("type", type);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (showAll) params.set("showAll", "true");

    const queryString = params.toString();
    router.push(queryString ? `/admin/db?${queryString}` : "/admin/db");
  };

  const clearFilters = () => {
    setProductId("");
    setType("");
    setStartDate("");
    setEndDate("");
    setShowAll(false);
    router.push("/admin/db");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Product
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-white min-w-[200px]"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sku} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAll"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showAll" className="text-sm text-gray-600">
            Show all (no limit)
          </label>
        </div>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
        >
          Apply
        </button>

        <button
          onClick={clearFilters}
          className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      <div className="text-xs text-gray-500">
        Showing {totalCount} movements
      </div>
    </div>
  );
}
