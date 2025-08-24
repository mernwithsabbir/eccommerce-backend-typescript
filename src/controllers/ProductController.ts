import { Request, Response } from "express";
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
import { upload, uploadProductImages } from "../middlewares/uploadMiddleware";
import path from "path";
import BrandModel from "../models/BrandModel";
import ProductModel from "../models/ProductModel";
import { safeUnlink } from "../utils/unlink";
import { Types } from "mongoose";
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
          await await safeUnlink(req.file?.path);
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
          await await safeUnlink(req.file?.path);
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
          await await safeUnlink(req.file?.path);
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
          await await safeUnlink(req.file?.path);
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
  uploadProductImages(req, res, async function (err) {
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
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const image = files?.["image"]?.[0];
      const gallery = files?.["gallery"] || [];
      const validate = productValidate.safeParse({
        title: req.body.title,
        shortDesc: req.body.shortDesc,
        price: req.body.price,
        discount: Boolean(req.body.discount),
        discountPrice: req.body.discountPrice,
        image: image,
        star: Number(req.body.star),
        stock: req.body.stock,
        remark: req.body.remark,
        categoryId: req.body.categoryId,
        brandId: req.body.brandId,
        details: {
          description: req.body.description,
          colors: req.body.colors ? JSON.parse(req.body.colors) : [],
          sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
          images: gallery,
        },
      });
      if (!validate.success) {
        if (image) {
          await safeUnlink(image?.path);
        }
        if (gallery.length > 0) {
          for (const img of gallery) {
            await safeUnlink(img.path);
          }
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
        if (image) {
          await safeUnlink(image.path);
        }
        if (gallery.length > 0) {
          for (const img of gallery) {
            await safeUnlink(img.path);
          }
        }
        return res.status(400).json({
          success: false,
          errorType: "existSlug",
          message: "Please Provide Unique Product Title",
        });
      }
      const imagePath = image ? `images/${image.filename}` : null;
      const galleryPaths = gallery.map((img) => `images/${img.filename}`);
      const createProduct = await ProductModel.create({
        title: data.title,
        slug: slugValue,
        shortDesc: data.shortDesc,
        price: data.price,
        discount: Boolean(data.discount),
        discountPrice: data.discountPrice,
        image: imagePath,
        star: Number(data.star),
        stock: data.stock,
        remark: data.remark,
        categoryId: data.categoryId,
        brandId: data.brandId,
        details: {
          description: data.details?.description,
          colors: data.details?.colors,
          sizes: data.details?.sizes,
          gallery: galleryPaths,
        },
      });
      if (!createProduct) {
        if (image) {
          await safeUnlink(image.path);
        }

        if (gallery.length > 0) {
          for (const img of gallery) {
            await safeUnlink(img.path);
          }
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
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = new Types.ObjectId(req.params.productId);
    await ProductModel.deleteOne({ _id: productId });
    res.status(400).json({
      success: true,
      message: "Product Deleted Successfully!",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};

// Read All Category|Brand|Product data

export const readCategory = async (req: Request, res: Response) => {
  try {
    const data = await CategoryModel.find();

    res.status(200).json({
      success: true,
      message: "Category Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};
export const readBrand = async (req: Request, res: Response) => {
  try {
    const data = await BrandModel.find();

    res.status(200).json({
      success: true,
      message: "Brand Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};
export const readOnlyProduct = async (req: Request, res: Response) => {
  try {
    const data = await ProductModel.aggregate([{ $project: { details: 0 } }]);

    res.status(200).json({
      success: true,
      message: "Product Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};

export const readProductDetails = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const data = await ProductModel.find({ slug: slug });
    console.log(slug);

    res.status(200).json({
      success: true,
      message: "Product Details Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};

export const readCategoryWithProductList = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryId = new Types.ObjectId(req.params.categoryId);
    const data = await ProductModel.aggregate([
      { $match: { categoryId: categoryId } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$brand" },
    ]);

    res.status(200).json({
      success: true,
      message: "Product With Category Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};
export const readBrandWithProductList = async (req: Request, res: Response) => {
  try {
    const brandId = new Types.ObjectId(req.params.brandId);
    const data = await ProductModel.aggregate([
      { $match: { brandId: brandId } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$category" },
      { $unwind: "$brand" },
    ]);

    res.status(200).json({
      success: true,
      message: "Product With Brand Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};
export const readRemarkWithProductList = async (
  req: Request,
  res: Response
) => {
  try {
    const remark = new Types.ObjectId(req.params.remark);
    const data = await ProductModel.find({ remark: remark });

    res.status(200).json({
      success: true,
      message: "Product With Remark Fetch Successfully",
      data: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something Went Wrong";
    return res.status(400).json({
      success: false,
      errorType: "server",
      message: message,
    });
  }
};
