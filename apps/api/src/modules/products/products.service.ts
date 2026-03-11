import { prisma } from "../../config/prisma";
import type { CreateProductDto } from "@fashion/shared";

export async function createProduct(userId: string, dto: CreateProductDto) {
  return prisma.product.create({
    data: { ...dto, userId },
  });
}

export async function getProducts(
  userId: string,
  opts: { store?: string; layer?: string; page: number; limit: number }
) {
  const { store, layer, page, limit } = opts;
  const where = {
    userId,
    ...(store && { store }),
    ...(layer && { layer }),
  };
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getProductById(userId: string, id: string) {
  const product = await prisma.product.findFirst({ where: { id, userId } });
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404, code: "NOT_FOUND" });
  return product;
}

export async function deleteProduct(userId: string, id: string) {
  const product = await prisma.product.findFirst({ where: { id, userId } });
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404, code: "NOT_FOUND" });
  await prisma.product.delete({ where: { id } });
}
