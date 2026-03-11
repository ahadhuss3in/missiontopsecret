import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createAccessorySchema } from "./accessories.schema";
import * as ctrl from "./accessories.controller";

export const accessoriesRouter = Router();

accessoriesRouter.use(requireAuth);

accessoriesRouter.get("/", ctrl.getAccessories);
accessoriesRouter.post("/", validate(createAccessorySchema), ctrl.createAccessory);
accessoriesRouter.get("/:id", ctrl.getAccessoryById);
accessoriesRouter.delete("/:id", ctrl.deleteAccessory);
