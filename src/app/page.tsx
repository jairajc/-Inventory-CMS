import { prisma } from "@/lib/db";
import Link from "next/link";

async function getDashboardStats() {
  const [totalProducts, totalCategories, lowStockCount, outOfStockCount] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.productCategory.count(),
      prisma.product.count({
        where: { stock: { lt: 10 }, active: true },
      }),
      prisma.product.count({
        where: { stock: 0, active: true },
      }),
    ]);

  const totalValue = await prisma.product.aggregate({
    where: { active: true },
    _sum: {
      stock: true,
    },
  });

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { stock: true, price: true },
  });

  const inventoryValue = products.reduce((sum, p) => {
    return sum + p.stock * Number(p.price);
  }, 0);

  return {
    totalProducts,
    totalCategories,
    lowStockCount,
    outOfStockCount,
    totalItems: totalValue._sum.stock || 0,
    inventoryValue,
  };
}

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalCategories}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalItems.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${stats.inventoryValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/products?lowStock=true"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Low Stock Alert
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.lowStockCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                products below threshold
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Out of Stock
              </h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.outOfStockCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                products need restock
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </Link>
        <Link
          href="/categories"
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
}
