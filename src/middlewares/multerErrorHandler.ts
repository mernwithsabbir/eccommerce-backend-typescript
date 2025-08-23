import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const multerErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    let message = "File upload error";

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image size too large. Max 2MB allowed.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Only images (jpg, jpeg, png, webp,jfif) are allowed!";
    }

    return res.status(400).json({ success: false, message });
  }

  // অন্য error হলে
  if (err) {
    return res.status(500).json({ success: false, message: err.message });
  }

  next();
};
