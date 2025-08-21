import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Register Routes Is Working",
  });
};
export const loginUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Login Routes Is Working",
  });
};
