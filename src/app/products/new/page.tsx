import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>

        <div className="p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
