import express from "express";
import { Authenticated } from "../middlewares/AuthMiddleware";
import { authorizeRole } from "../middlewares/AuthorizedRole";
import {
  createBrand,
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
  "/addBrand",
  Authenticated,
  authorizeRole(["admin"]),
  createBrand
);
productRouter.post(
  "/addProduct",
  Authenticated,
  authorizeRole(["admin"]),
  createProduct
);
export default productRouter;
