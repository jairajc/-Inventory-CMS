import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock") === "true";
    const categoryId = searchParams.get("category");

    const where: any = {};

    if (lowStock) {
      where.stock = { lte: 5 };
      where.active = true;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sku, description, price, stock, active, categoryId } = body;

    if (!name || !sku || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, SKU, price, and category are required" },
        { status: 400 },
      );
    }

    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description: description || null,
        price,
        stock: stock || 0,
        active: active ?? true,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
