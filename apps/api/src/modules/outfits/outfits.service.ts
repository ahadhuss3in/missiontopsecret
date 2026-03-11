import { prisma } from "../../config/prisma";

const itemsInclude = {
  product: true,
} as const;

export async function createOutfit(userId: string, data: { name: string; description?: string; isPublic?: boolean }) {
  return prisma.outfit.create({ data: { ...data, userId } });
}

export async function getOutfits(userId: string, opts: { page: number; limit: number }) {
  const { page, limit } = opts;
  const where = { userId };
  const [data, total] = await Promise.all([
    prisma.outfit.findMany({
      where,
      include: { items: { include: itemsInclude } },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.outfit.count({ where }),
  ]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getOutfitById(userId: string, id: string) {
  const outfit = await prisma.outfit.findFirst({
    where: { id, userId },
    include: { items: { include: itemsInclude } },
  });
  if (!outfit) throw Object.assign(new Error("Outfit not found"), { status: 404, code: "NOT_FOUND" });
  return outfit;
}

export async function updateOutfit(userId: string, id: string, data: Record<string, unknown>) {
  const outfit = await prisma.outfit.findFirst({ where: { id, userId } });
  if (!outfit) throw Object.assign(new Error("Outfit not found"), { status: 404, code: "NOT_FOUND" });
  return prisma.outfit.update({ where: { id }, data });
}

export async function deleteOutfit(userId: string, id: string) {
  const outfit = await prisma.outfit.findFirst({ where: { id, userId } });
  if (!outfit) throw Object.assign(new Error("Outfit not found"), { status: 404, code: "NOT_FOUND" });
  await prisma.outfit.delete({ where: { id } });
}
