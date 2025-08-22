import express from "express";
import { Authenticated } from "../middlewares/AuthMiddleware";
import { authorizeRole } from "../middlewares/AuthorizedRole";
import { createProduct } from "../controllers/ProductController";
const productRouter = express.Router();

productRouter.post(
  "/addProduct",
  Authenticated,
  authorizeRole(["admin"]),
  createProduct
);
export default productRouter;
