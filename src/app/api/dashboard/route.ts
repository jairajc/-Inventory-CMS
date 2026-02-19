import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [totalProducts, totalCategories, lowStockCount, outOfStockCount] =
      await Promise.all([
        prisma.product.count({ where: { active: true } }),
        prisma.productCategory.count(),
        prisma.product.count({
          where: { stock: { lt: 10 } },
        }),
        prisma.product.count({
          where: { stock: 0, active: true },
        }),
      ]);

    const products = await prisma.product.findMany({
      where: { active: true },
      select: { stock: true, price: true },
    });

    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
    const inventoryValue = products.reduce((sum, p) => {
      return sum + p.stock * Number(p.price);
    }, 0);

    return NextResponse.json({
      totalProducts,
      totalCategories,
      lowStockCount,
      outOfStockCount,
      totalItems,
      inventoryValue,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
