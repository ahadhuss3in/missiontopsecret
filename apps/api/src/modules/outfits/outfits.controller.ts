import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as OutfitsService from "./outfits.service";
import { z } from "zod";

const pageSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createOutfit = asyncHandler(async (req: Request, res: Response) => {
  const outfit = await OutfitsService.createOutfit(req.userId!, req.body);
  res.status(201).json({ data: outfit });
});

export const getOutfits = asyncHandler(async (req: Request, res: Response) => {
  const query = pageSchema.parse(req.query);
  const result = await OutfitsService.getOutfits(req.userId!, query);
  res.status(200).json(result);
});

export const getOutfitById = asyncHandler(async (req: Request, res: Response) => {
  const outfit = await OutfitsService.getOutfitById(req.userId!, req.params.id);
  res.status(200).json({ data: outfit });
});

export const updateOutfit = asyncHandler(async (req: Request, res: Response) => {
  const outfit = await OutfitsService.updateOutfit(req.userId!, req.params.id, req.body);
  res.status(200).json({ data: outfit });
});

export const deleteOutfit = asyncHandler(async (req: Request, res: Response) => {
  await OutfitsService.deleteOutfit(req.userId!, req.params.id);
  res.status(204).send();
});
