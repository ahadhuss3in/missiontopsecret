import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as OutfitItemsService from "./outfitItems.service";

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await OutfitItemsService.addItem(req.userId!, req.params.outfitId, req.body);
  res.status(201).json({ data: item });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await OutfitItemsService.updateItem(req.userId!, req.params.outfitId, req.params.itemId, req.body);
  res.status(200).json({ data: item });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  await OutfitItemsService.removeItem(req.userId!, req.params.outfitId, req.params.itemId);
  res.status(204).send();
});
