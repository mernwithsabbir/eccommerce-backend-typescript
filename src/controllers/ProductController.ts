import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Create Product Router Is Working",
  });
};
