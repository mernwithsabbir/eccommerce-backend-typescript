import { Request, Response } from "express";
import fs from "fs/promises";
import {
  BrandDto,
  brandValidate,
  CategoryDto,
  categoryValidate,
  ProductDto,
  productValidate,
} from "../dtos/product.dtos";
import slug from "slug";
import CategoryModel from "../models/CategoryModel";
import multer from "multer";
import { upload } from "../middlewares/uploadMiddleware";
import path from "path";
import BrandModel from "../models/BrandModel";
import ProductModel from "../models/ProductModel";
export const createCategory = async (req: Request, res: Response) => {
  upload.single("categoryImage")(req, res, async function (err) {
    try {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              errorType: "LIMIT_FILE_SIZE",
              message: "Max File Size Required 5mb or Less!",
            });
          }
        }
        return res.status(400).json({
          success: false,
          errorType: "multer",
          message: err.message,
        });
      }
      const validate = categoryValidate.safeParse({
        categoryName: req.body.categoryName,
        categoryImage: req.file,
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

      const data: CategoryDto = validate.data!;
      const slugValue = slug(data.categoryName);

      const existSlug = await CategoryModel.findOne({ slug: slugValue });
      if (existSlug) {
        if (req.file) {
          await fs.unlink(req.file?.path);
        }
        return res.status(400).json({
          success: false,
          errorType: "slug",
          message: "Please Enter Unique Category Name.",
        });
      }

      const filePath = req.file ? path.join("images", req.file.filename) : null;

      await CategoryModel.create({
        categoryName: req.body.categoryName,
        slug: slugValue,
        categoryImage: filePath,
      });
      res.status(200).json({
        success: true,
        message: "Category Create Successfully",
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

export const createBrand = async (req: Request, res: Response) => {
  upload.single("brandImage")(req, res, async function (err) {
    try {
      if (err) {
        if (err instanceof multer.MulterError) {
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

      const validate = brandValidate.safeParse({
        brandName: req.body.brandName,
        brandImage: req.file,
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
      const data = validate.data as BrandDto;
      const slugValue = slug(data.brandName);
      const existSlug = await BrandModel.findOne({ slug: slugValue });
      if (existSlug) {
        if (req.file) {
          await fs.unlink(req.file?.path);
        }
        return res.status(400).json({
          success: false,
          errorType: "slug",
          message: "PLease Provide Unique Brand Name!",
        });
      }
      const filePath = req.file ? `images/${req.file.filename}` : null;
      const createBrand = await BrandModel.create({
        brandName: data.brandName,
        slug: slugValue,
        brandImage: filePath,
      });
      if (!createBrand) {
        res.status(400).json({
          success: false,
          errorType: "notCreate",
          message: "Something Went Wrong Brand Not Created!",
        });
      }
      res.status(400).json({
        success: true,
        message: "Brand Created Successfully!",
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        success: false,
        errorType: "multer",
        message: "Internal Server Error!",
      });
    }
  });
};

export const createProduct = async (req: Request, res: Response) => {
  upload.single("image")(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            errorType: "LIMIT_FILE_SIZE",
            message: "Maximum File Size 5mb Or Less!",
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
    try {
      const validate = productValidate.safeParse({
        title: req.body.title,
        shortDesc: req.body.shortDesc,
        price: req.body.price,
        discount: Boolean(req.body.discount),
        discountPrice: req.body.discountPrice,
        image: req.file,
        star: Number(req.body.star),
        stock: req.body.stock,
        remark: req.body.remark,
        categoryId: req.body.categoryId,
        brandId: req.body.brandId,
      });
      if (!validate.success) {
        if (req.file) {
          fs.unlink(req.file?.path);
        }
        return res.status(400).json({
          success: false,
          errorType: "dto",
          message: validate.error.flatten().fieldErrors,
        });
      }

      const data = validate.data as ProductDto;
      const slugValue = slug(data.title);
      const existSlug = await ProductModel.findOne({ slug: slugValue });

      if (existSlug) {
        if (req.file) {
          fs.unlink(req.file?.path);
        }
        return res.status(400).json({
          success: false,
          errorType: "existSlug",
          message: "Please Provide Unique Product Title",
        });
      }
      const filePath = req.file ? `images/${req.file.filename}` : null;
      const createProduct = await ProductModel.create({
        title: data.title,
        slug: slugValue,
        shortDesc: data.shortDesc,
        price: data.price,
        discount: Boolean(data.discount),
        discountPrice: data.discountPrice,
        image: filePath,
        star: Number(data.star),
        stock: data.stock,
        remark: data.remark,
        categoryId: data.categoryId,
        brandId: data.brandId,
      });
      if (!createProduct) {
        if (req.file) {
          fs.unlink(req.file?.path);
        }
        return res.status(400).json({
          success: false,
          errorType: "create",
          message: "Something Went Wrong.Product Not Created!",
        });
      }
      res.status(200).json({
        success: true,
        message: "Create Product Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        errorType: "server",
        message: error,
      });
    }
  });
};
