import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  LoginDto,
  loginValidate,
  RegisterDto,
  registerValidate,
} from "../dtos/auth.dtos";
import UserModel, { IUserInterface } from "../models/UserModel";
import {
  newJti,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { getExpiryDate } from "../utils/getExpiryDate";
import config from "../config/config";
import TokenModel, {
  IRefreshTokenInterface,
} from "../models/RefreshTokenModel";
import { clearAuthCookie, setAuthCookies } from "../utils/cookie";
import { tokenDataInterface } from "../types/token";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validate = registerValidate.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({
        success: false,
        errorType: "dtos",
        message: validate.error.flatten().fieldErrors,
      });
    }

    const data: RegisterDto = validate.data!;

    const existUser = await UserModel.findOne<IUserInterface>({
      email: data.email,
    });

    if (existUser) {
      res.status(400).json({
        success: false,
        errorType: "existUser",
        message: "User Already Exist.Try Another Email Address!",
      });
    }

    const createUser = await UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      provider: data.provider,
      role: data.role,
      password: data.password,
    });

    if (!createUser) {
      res.status(400).json({
        success: false,
        errorType: "createUser",
        message: "Something Went Wrong User Not Created!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Register Successfully!",
      data: {
        userId: createUser._id,
        isVerified: createUser.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorType: "server",
      message: error,
    });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const validate = loginValidate.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({
        success: false,
        errorType: "dtos",
        message: validate.error.flatten().fieldErrors,
      });
    }
    const data: LoginDto = validate.data!;

    const existUser = await UserModel.findOne({ email: data.email }).select(
      "+password"
    );
    if (!existUser) {
      res.status(400).json({
        success: false,
        errorType: "existUser",
        message: "Invalid Email Address.Please Provide Valid Email.",
      });
    }

    const compare = existUser?.comparePassword(data.password);
    if (!compare) {
      res.status(400).json({
        success: false,
        errorType: "comparePass",
        message: "Invalid Password.Please Provide Valid Password.",
      });
    }

    const jti = newJti();
    const accessToken = signAccessToken(existUser as IUserInterface);
    const refreshToken = signRefreshToken(existUser as IUserInterface, jti);
    const expiresAt = getExpiryDate(
      config.REFRESH_TOKEN_EXPIRES_IN,
      7 * 24 * 3600 * 1000
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await TokenModel.create({
      userId: existUser?._id,
      jti,
      tokenHash,
      tokenType: "refresh",
      expiresAt,
    });

    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorType: "server",
      message: error,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      clearAuthCookie(res);
      res.status(401).json({
        success: false,
        errorType: "tokenNotFound",
        message: "Refresh Token not Found!",
      });
    }

    const payload = verifyToken(token) as tokenDataInterface;
    if (!payload) {
      clearAuthCookie(res);
      res.status(401).json({
        success: false,
        errorType: "invalidToken",
        message: "Refresh Token Invalid/Expired!",
      });
    }

    const existUser = (await UserModel.findById(
      payload.userId
    )) as IUserInterface;
    if (!existUser) {
      clearAuthCookie(res);
      res.status(401).json({
        success: false,
        errorType: "existUser",
        message: "User Not Found!",
      });
    }

    const tokenCheck = (await TokenModel.findOne({
      userId: existUser!._id,
      jti: payload.jti,
    })) as IRefreshTokenInterface;
    if (!tokenCheck) {
      clearAuthCookie(res);
      res.status(401).json({
        success: false,
        errorType: "invalidToken",
        message: "Token Data Not Match!",
      });
    }

    const compare = await bcrypt.compare(token, tokenCheck!.tokenHash);
    if (!compare) {
      clearAuthCookie(res);
      res.status(401).json({
        success: false,
        errorType: "compare",
        message: "Token Mismatch.All Session Revoked!",
      });
    }

    await TokenModel.deleteOne({ _id: tokenCheck?._id });

    const jti = newJti();
    const accessToken = signAccessToken(existUser);
    const refreshToken = signRefreshToken(existUser, jti);
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = getExpiryDate(
      config.REFRESH_TOKEN_EXPIRES_IN,
      7 * 24 * 3600 * 1000
    );

    await TokenModel.create({
      userId: existUser._id,
      jti,
      tokenHash,
      tokenType: "refresh",
      expiresAt,
    });

    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({
      success: true,
      message: "Token Refresh Successfully!",
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorType: "server",
      message: error,
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = req.user as tokenDataInterface;

    const existUser = await UserModel.findOne({ email: user.email });

    if (!user.email || !existUser) {
      res.status(400).json({
        success: false,
        message: "Invalid Email Address in Your Token!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully Get User Data!",
      data: existUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorType: "server",
      message: error,
    });
  }
};
