import { prisma } from "./db";
import { ProductCategory } from "@prisma/client";
import NodeCache from "node-cache";

// TTL in seconds (1 hour)
const cache = new NodeCache({ stdTTL: 60 * 60 });

export async function getCategories(): Promise<ProductCategory[]> {
  const cached = cache.get<ProductCategory[]>("categories");

  if (cached) {
    return cached;
  }

  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  cache.set("categories", categories);
  return categories;
}

export { cache };
