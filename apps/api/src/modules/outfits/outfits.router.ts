import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createOutfitSchema, updateOutfitSchema } from "./outfits.schema";
import * as ctrl from "./outfits.controller";
import { outfitItemsRouter } from "../outfitItems/outfitItems.router";

export const outfitsRouter = Router();

outfitsRouter.use(requireAuth);

outfitsRouter.get("/", ctrl.getOutfits);
outfitsRouter.post("/", validate(createOutfitSchema), ctrl.createOutfit);
outfitsRouter.get("/:id", ctrl.getOutfitById);
outfitsRouter.patch("/:id", validate(updateOutfitSchema), ctrl.updateOutfit);
outfitsRouter.delete("/:id", ctrl.deleteOutfit);

// nested items routes
outfitsRouter.use("/:outfitId/items", outfitItemsRouter);
