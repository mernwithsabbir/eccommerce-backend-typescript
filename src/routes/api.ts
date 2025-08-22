import express from "express";
import authRouter from "./authRoutes";
import productRouter from "./productRoutes";

const apiRouter = express.Router();
// Auth Routers
apiRouter.use("/api/v1/auth", authRouter);
apiRouter.use("/api/v1", productRouter);
export default apiRouter;
