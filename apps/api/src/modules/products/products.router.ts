import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createProductSchema } from "./products.schema";
import * as ctrl from "./products.controller";

export const productsRouter = Router();

productsRouter.use(requireAuth);

productsRouter.get("/", ctrl.getProducts);
productsRouter.post("/", validate(createProductSchema), ctrl.createProduct);
productsRouter.get("/:id", ctrl.getProductById);
productsRouter.delete("/:id", ctrl.deleteProduct);
