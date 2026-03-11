import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { addOutfitItemSchema, updateOutfitItemSchema } from "./outfitItems.schema";
import * as ctrl from "./outfitItems.controller";

// Note: this router is mounted at "/:outfitId/items" via outfits.router.ts
// mergeParams: true lets us access req.params.outfitId
export const outfitItemsRouter = Router({ mergeParams: true });

outfitItemsRouter.post("/", validate(addOutfitItemSchema), ctrl.addItem);
outfitItemsRouter.patch("/:itemId", validate(updateOutfitItemSchema), ctrl.updateItem);
outfitItemsRouter.delete("/:itemId", ctrl.removeItem);
