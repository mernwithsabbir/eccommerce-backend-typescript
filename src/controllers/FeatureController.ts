import { Request, Response } from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { MulterError } from "multer";
import fs from "fs/promises";
import { FeatureDto, featureValidate } from "../dtos/feature.dtos";
import FeatureModel from "../models/FeatureModel";

export const createFeatured = async (req: Request, res: Response) => {
  upload.single("image")(req, res, async function (err) {
    try {
      if (err) {
        if (err instanceof MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              errorType: "LIMIT_FILE_SIZE",
              message: "File is too large. Max 5MB allowed.",
            });
          } else {
            return res.status(400).json({
              success: false,
              errorType: "multer",
              message: err.message,
            });
          }
        }
        return res.status(400).json({
          success: false,
          errorType: "multer",
          message: err.message,
        });
      }

      //    Start The Feature Topic
      const validate = featureValidate.safeParse({
        name: req.body.name,
        image: req.file,
        description: req.body.description,
      });

      if (!validate.success) {
        if (req.file) {
          await fs.unlink(req.file?.path);
        }
        return res.status(400).json({
          success: false,
          errorType: "dto",
          message: validate.error.flatten().fieldErrors,
        });
      }
      const data = validate.data as FeatureDto;

      const filePath = req.file ? `images/${req.file.filename}` : null;
      const createFeatured = await FeatureModel.create({
        name: data.name,
        image: filePath,
        description: data.description,
      });
      if (!createFeatured) {
        res.status(400).json({
          success: false,
          errorType: "notCreate",
          message: "Something Went Wrong Featured Not Created!",
        });
      }
      res.status(400).json({
        success: true,
        message: "Featured Created Successfully!",
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        success: false,
        errorType: "server",
        message: "Internal Server Error!",
      });
    }
  });
};
