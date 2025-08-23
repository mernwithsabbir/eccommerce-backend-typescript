import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, `${suffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowFileTypes = /jpeg|jpg|png|webp/;
  const ext = allowFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowFileTypes.test(file.mimetype);

  if (ext && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only Allow jpeg|jpg|png|webp formate"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});
