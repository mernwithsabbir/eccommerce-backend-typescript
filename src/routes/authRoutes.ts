import express from "express";
import {
  loginUser,
  me,
  refreshToken,
  registerUser,
} from "../controllers/UserControllers";
import { Authenticated } from "../middlewares/AuthMiddleware";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh", refreshToken);
authRouter.get("/me", Authenticated, me);

export default authRouter;
