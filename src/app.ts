import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/api";
import { errorHandler, notFound } from "./middlewares/GlobalErrorHandler";
const app = express();

app.use(helmet());
app.use(hpp());
app.use(cors());

app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.set("etag", false);

app.use(apiRouter);

app.use(notFound);
app.use(errorHandler);
export default app;
