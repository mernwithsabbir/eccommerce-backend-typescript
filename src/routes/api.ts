import express from "express";
import authRouter from "./authRoutes";
import productRouter from "./productRoutes";
import featureRouter from "./featureRouter";
import cartRouter from "./cartRoutes";

const apiRouter = express.Router();
// Routers
apiRouter.use("/api/v1/auth", authRouter);
apiRouter.use("/api/v1", productRouter);
apiRouter.use("/api/v1", featureRouter);
apiRouter.use("/api/v1", cartRouter);
export default apiRouter;
