import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const reasons = {
  IN: [
    "Restock",
    "Return from customer",
    "Inventory adjustment",
    "Transfer from warehouse",
  ],
  OUT: ["Sale", "Damaged", "Return to supplier", "Lost/stolen", "Sample"],
};

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export async function POST() {
  try {
    const products = await prisma.product.findMany();

    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: "No products found. Seed products first." },
        { status: 400 },
      );
    }

    await prisma.stockMovement.deleteMany();

    let totalMovements = 0;

    for (const product of products) {
      const movementCount = Math.floor(Math.random() * 20) + 10;

      for (let i = 0; i < movementCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const type = Math.random() > 0.3 ? "OUT" : "IN";
        const quantity = Math.floor(Math.random() * 10) + 1;
        const reasonOptions = reasons[type as keyof typeof reasons];
        const reason =
          reasonOptions[Math.floor(Math.random() * reasonOptions.length)];

        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            type,
            quantity,
            reason,
            createdAt: subDays(new Date(), daysAgo),
          },
        });

        totalMovements++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${totalMovements} stock movements for ${products.length} products`,
    });
  } catch (error) {
    console.error("Seed movements error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
