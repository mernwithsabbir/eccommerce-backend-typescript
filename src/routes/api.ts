import express from "express";
import authRouter from "./authRoutes";

const apiRouter = express.Router();
// Auth Routers
apiRouter.use("/api/v1/auth", authRouter);
export default apiRouter;
