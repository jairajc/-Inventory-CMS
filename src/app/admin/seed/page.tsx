"use client";

import { useState } from "react";

export default function SeedPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const seedDatabase = async () => {
    setLoading("products");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Failed to seed database");
    } finally {
      setLoading(null);
    }
  };

  const seedMovements = async () => {
    setLoading("movements");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/seed-movements", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Failed to seed movements");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Admin: Seed Database
      </h1>
      <p className="text-gray-500 mb-8">Hidden page for interviewers</p>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">
            1. Seed Products & Categories
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Clears existing data and creates 5 categories with 15 products each.
          </p>
          <button
            onClick={seedDatabase}
            disabled={loading !== null}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading === "products" ? "Seeding..." : "Seed Products"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">
            2. Seed Stock Movements
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Creates 10-30 random movements per product over the last 30 days.
            <br />
            <strong>Note:</strong> Only run after candidate completes Phase 3
            (StockMovement model).
          </p>
          <button
            onClick={seedMovements}
            disabled={loading !== null}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading === "movements" ? "Seeding..." : "Seed Movements"}
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-mono">{message}</p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-400">
        <a href="/admin/db" className="hover:text-gray-600">
          View Database →
        </a>
      </div>
    </div>
  );
}
