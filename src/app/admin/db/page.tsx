import { prisma } from "@/lib/db";
import MovementsFilter from "@/components/MovementsFilter";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getData(filters: {
  productId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  showAll?: boolean;
}) {
  const [categories, products] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    }),
  ]);

  let movements: any[] = [];
  try {
    const where: any = {};

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    movements = await prisma.stockMovement.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: filters.showAll ? undefined : 100,
    });
  } catch {
    // StockMovement table doesn't exist yet
  }

  return { categories, products, movements };
}

export default async function DatabaseViewerPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters = {
    productId:
      typeof params.productId === "string" ? params.productId : undefined,
    type: typeof params.type === "string" ? params.type : undefined,
    startDate:
      typeof params.startDate === "string" ? params.startDate : undefined,
    endDate: typeof params.endDate === "string" ? params.endDate : undefined,
    showAll: params.showAll === "true",
  };

  const { categories, products, movements } = await getData(filters);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Admin: Database Viewer
      </h1>
      <p className="text-gray-500 mb-8">Hidden page for interviewers</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Categories ({categories.length})
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="px-4 py-2 font-mono text-xs">{cat.id}</td>
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2 text-gray-500">
                      {cat.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Products ({products.length})
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    SKU
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Stock
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Active
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={
                      !product.active ? "bg-gray-50 text-gray-400" : ""
                    }
                  >
                    <td className="px-4 py-2 font-mono text-xs">
                      {product.id}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.category.name}</td>
                    <td className="px-4 py-2">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          product.stock < 10 ? "text-red-600 font-semibold" : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {product.active ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Stock Movements</h2>

          <MovementsFilter
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
            }))}
            totalCount={movements.length}
          />

          {movements.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No stock movements found. The StockMovement model may not exist
              yet (Phase 3).
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Product ID
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {movements.map((movement: any) => (
                    <tr key={movement.id}>
                      <td className="px-4 py-2 font-mono text-xs">
                        {movement.id}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {movement.product.sku} - {movement.product.name}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {movement.productId}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            movement.type === "IN"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {movement.type}
                        </span>
                      </td>
                      <td className="px-4 py-2">{movement.quantity}</td>
                      <td className="px-4 py-2 text-gray-500">
                        {movement.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-400">
        <a href="/admin/seed" className="hover:text-gray-600">
          ← Seed Database
        </a>
      </div>
    </div>
  );
}
