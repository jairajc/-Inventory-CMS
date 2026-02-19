import { prisma } from "@/lib/db";
import { formatPrice, formatDate, getStockStatus } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  return product;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          &larr; Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-gray-900">
                {product.description || "No description available"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Category
              </h3>
              <p className="text-gray-900">{product.category.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Price</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(Number(product.price))}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Stock Level
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  {product.stock}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stockStatus.color === "red"
                      ? "bg-red-100 text-red-800"
                      : stockStatus.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {stockStatus.label}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Created At
              </h3>
              <p className="text-gray-900">{formatDate(product.createdAt)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Last Updated
              </h3>
              <p className="text-gray-900">{formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-4">
            <Link
              href={`/products/${product.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Product
            </Link>
            <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
              Delete Product
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder for Stock Movements - Phase 3 */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Stock Movements
        </h2>
        <p className="text-gray-500 text-sm">
          Stock movement tracking will be implemented here.
        </p>
      </div>
    </div>
  );
}
