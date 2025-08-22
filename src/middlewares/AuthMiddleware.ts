import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { tokenDataInterface } from "../types/token";

export const Authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1️⃣ Header থেকে নাও
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Cookie থেকে নাও
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 3️⃣ Token না পেলে error
    if (!token) {
      return res.status(401).json({
        success: false,
        errorType: "noToken",
        message: "Authorization Token Not Found!",
      });
    }

    // 4️⃣ Verify করো
    jwt.verify(token, config.JWT_SECRET as string, (err, decode) => {
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? "Token Expired Please Login Again!"
            : "Invalid Token Authentication Fail.";

        return res.status(401).json({
          success: false,
          errorType: "tokenInvalid",
          message,
        });
      }

      // 5️⃣ এখন req.user safe
      req.user = decode as tokenDataInterface;

      next(); // 🚀 next() call করতে ভুলো না
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorType: "server",
      message: "Internal server error in authentication",
      error: config.NODE_ENV === "development" ? error : "",
    });
  }
};
