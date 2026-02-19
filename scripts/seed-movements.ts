import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

const reasons = {
  IN: [
    "Restock",
    "Return from customer",
    "Inventory adjustment",
    "Transfer from warehouse",
  ],
  OUT: ["Sale", "Damaged", "Return to supplier", "Lost/stolen", "Sample"],
};

async function main() {
  console.log("Seeding stock movements...");

  const products = await prisma.product.findMany();

  if (products.length === 0) {
    console.error("No products found. Please run the initial seed first.");
    process.exit(1);
  }

  for (const product of products) {
    // Random number of movements: 10-30 per product
    const movementCount = Math.floor(Math.random() * 20) + 10;

    for (let i = 0; i < movementCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const type = Math.random() > 0.3 ? "OUT" : "IN"; // 70% OUT, 30% IN
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
    }
  }

  console.log("Stock movements seeded successfully!");
  console.log(`Created movements for ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
