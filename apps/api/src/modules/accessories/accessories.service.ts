import { prisma } from "../../config/prisma";

export async function createAccessory(userId: string, dto: Record<string, unknown>) {
  return prisma.accessory.create({ data: { ...(dto as any), userId } });
}

export async function getAccessories(userId: string, opts: { category?: string; page: number; limit: number }) {
  const { category, page, limit } = opts;
  const where = { userId, ...(category && { category }) };
  const [data, total] = await Promise.all([
    prisma.accessory.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.accessory.count({ where }),
  ]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getAccessoryById(userId: string, id: string) {
  const item = await prisma.accessory.findFirst({ where: { id, userId } });
  if (!item) throw Object.assign(new Error("Accessory not found"), { status: 404, code: "NOT_FOUND" });
  return item;
}

export async function deleteAccessory(userId: string, id: string) {
  const item = await prisma.accessory.findFirst({ where: { id, userId } });
  if (!item) throw Object.assign(new Error("Accessory not found"), { status: 404, code: "NOT_FOUND" });
  await prisma.accessory.delete({ where: { id } });
}
