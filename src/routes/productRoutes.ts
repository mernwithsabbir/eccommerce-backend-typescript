import express from "express";
import { Authenticated } from "../middlewares/AuthMiddleware";
import { authorizeRole } from "../middlewares/AuthorizedRole";
import {
  createBrand,
  createCategory,
  createProduct,
  deleteProduct,
  readBrand,
  readBrandWithProductList,
  readCategory,
  readCategoryWithProductList,
  readOnlyProduct,
  readProductDetails,
  readRemarkWithProductList,
} from "../controllers/ProductController";
const productRouter = express.Router();
// All Admin Routes
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
productRouter.delete(
  "/deleteProduct/:productId",
  Authenticated,
  authorizeRole(["admin"]),
  deleteProduct
);

// Global Access Routes
productRouter.get("/readCategory", readCategory);
productRouter.get("/readBrand", readBrand);
productRouter.get("/readOnlyProduct", readOnlyProduct);
productRouter.get("/readProductDetails/:slug", readProductDetails);
productRouter.get(
  "/readCategoryWithProductList/:categoryId",
  readCategoryWithProductList
);
productRouter.get(
  "/readBrandWithProductList/:brandId",
  readBrandWithProductList
);
productRouter.get(
  "/readRemarkWithProductList/:remark",
  readRemarkWithProductList
);
export default productRouter;
