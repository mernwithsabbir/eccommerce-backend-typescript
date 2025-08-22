import type { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(createHttpError(404, "Route not found"));
}

export function errorHandler(err: HttpError, req: Request, res: Response) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") {
    console.error("[Error]", err);
  }
  res.status(status).json({ error: message });
}
