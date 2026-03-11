import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as AccessoriesService from "./accessories.service";
import { z } from "zod";

const querySchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createAccessory = asyncHandler(async (req: Request, res: Response) => {
  const item = await AccessoriesService.createAccessory(req.userId!, req.body);
  res.status(201).json({ data: item });
});

export const getAccessories = asyncHandler(async (req: Request, res: Response) => {
  const query = querySchema.parse(req.query);
  const result = await AccessoriesService.getAccessories(req.userId!, query);
  res.status(200).json(result);
});

export const getAccessoryById = asyncHandler(async (req: Request, res: Response) => {
  const item = await AccessoriesService.getAccessoryById(req.userId!, req.params.id);
  res.status(200).json({ data: item });
});

export const deleteAccessory = asyncHandler(async (req: Request, res: Response) => {
  await AccessoriesService.deleteAccessory(req.userId!, req.params.id);
  res.status(204).send();
});
