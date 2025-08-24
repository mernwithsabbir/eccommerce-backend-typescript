import express from "express";
import { createCart } from "../controllers/CartController";

const cartRouter = express.Router();

cartRouter.post("/addCart", createCart);

export default cartRouter;
