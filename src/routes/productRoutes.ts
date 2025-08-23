import express from "express";
import { Authenticated } from "../middlewares/AuthMiddleware";
import { authorizeRole } from "../middlewares/AuthorizedRole";
import {
  createCategory,
  createProduct,
} from "../controllers/ProductController";
const productRouter = express.Router();

productRouter.post(
  "/addCategories",
  Authenticated,
  authorizeRole(["admin"]),
  createCategory
);
productRouter.post(
  "/addProduct",
  Authenticated,
  authorizeRole(["admin"]),
  createProduct
);
export default productRouter;
