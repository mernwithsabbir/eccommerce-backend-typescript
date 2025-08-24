import express from "express";
import authRouter from "./authRoutes";
import productRouter from "./productRoutes";
import featureRouter from "./featureRouter";

const apiRouter = express.Router();
// Auth Routers
apiRouter.use("/api/v1/auth", authRouter);
apiRouter.use("/api/v1", productRouter);
apiRouter.use("/api/v1", featureRouter);
export default apiRouter;
