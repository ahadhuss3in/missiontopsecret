import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as ProductsService from "./products.service";
import { productQuerySchema } from "./products.schema";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductsService.createProduct(req.userId!, req.body);
  res.status(201).json({ data: product });
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);
  const result = await ProductsService.getProducts(req.userId!, query);
  res.status(200).json(result);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductsService.getProductById(req.userId!, req.params.id);
  res.status(200).json({ data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await ProductsService.deleteProduct(req.userId!, req.params.id);
  res.status(204).send();
});
