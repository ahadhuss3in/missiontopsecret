import { prisma } from "../../config/prisma";
import { LAYER_ORDER } from "@fashion/shared";
import type { LayerName } from "@fashion/shared";

async function assertOutfitOwner(outfitId: string, userId: string) {
  const outfit = await prisma.outfit.findFirst({ where: { id: outfitId, userId } });
  if (!outfit) throw Object.assign(new Error("Outfit not found"), { status: 404, code: "NOT_FOUND" });
  return outfit;
}

export async function addItem(
  userId: string,
  outfitId: string,
  dto: { productId: string; positionX: number; positionY: number; scale: number; zIndex?: number }
) {
  await assertOutfitOwner(outfitId, userId);

  const product = await prisma.product.findFirst({ where: { id: dto.productId, userId } });
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404, code: "NOT_FOUND" });

  const zIndex = dto.zIndex ?? LAYER_ORDER[product.layer as LayerName] ?? 3;

  const item = await prisma.outfitItem.upsert({
    where: { outfitId_productId: { outfitId, productId: dto.productId } },
    create: { outfitId, productId: dto.productId, positionX: dto.positionX, positionY: dto.positionY, scale: dto.scale, zIndex },
    update: { positionX: dto.positionX, positionY: dto.positionY, scale: dto.scale, zIndex },
    include: { product: true },
  });
  return item;
}

export async function updateItem(
  userId: string,
  outfitId: string,
  itemId: string,
  dto: { positionX?: number; positionY?: number; scale?: number; zIndex?: number }
) {
  await assertOutfitOwner(outfitId, userId);
  const item = await prisma.outfitItem.findFirst({ where: { id: itemId, outfitId } });
  if (!item) throw Object.assign(new Error("Item not found"), { status: 404, code: "NOT_FOUND" });
  return prisma.outfitItem.update({ where: { id: itemId }, data: dto, include: { product: true } });
}

export async function removeItem(userId: string, outfitId: string, itemId: string) {
  await assertOutfitOwner(outfitId, userId);
  const item = await prisma.outfitItem.findFirst({ where: { id: itemId, outfitId } });
  if (!item) throw Object.assign(new Error("Item not found"), { status: 404, code: "NOT_FOUND" });
  await prisma.outfitItem.delete({ where: { id: itemId } });
}
