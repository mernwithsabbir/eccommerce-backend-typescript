import { Request, Response } from "express";
import { CartDto, cartValidate } from "../dtos/cart.dtos";
import CartModel from "../models/CartModel";

export const createCart = async (req: Request, res: Response) => {
  try {
    const validate = cartValidate.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        errorType: "dto",
        message: validate.error.flatten().fieldErrors,
      });
    }
    const data = validate.data as CartDto;
    const createBrand = await CartModel.create(data);
    if (!createBrand) {
      res.status(400).json({
        success: false,
        errorType: "notCreate",
        message: "Something Went Wrong Brand Not Created!",
      });
    }
    res.status(400).json({
      success: true,
      message: "Cart Created Successfully!",
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
      errorType: "multer",
      message: "Internal Server Error!",
    });
  }
};
