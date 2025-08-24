import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  LoginDto,
  loginValidate,
  ProfileDto,
  profileValidate,
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
import UserProfile from "../models/UserProfileModel";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validate = registerValidate.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({
        success: false,
        errorType: "dto",
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
        errorType: "dto",
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

    const jti = newJti();
    const accessToken = signAccessToken(existUser);
    const refreshToken = signRefreshToken(existUser, jti);
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = getExpiryDate(
      config.REFRESH_TOKEN_EXPIRES_IN,
      7 * 24 * 3600 * 1000
    );

    const storedToken = await TokenModel.create({
      userId: existUser._id,
      jti,
      tokenHash,
      tokenType: "refresh",
      expiresAt,
    });
    if (storedToken) {
      await TokenModel.deleteOne({ _id: tokenCheck?._id });
      setAuthCookies(res, accessToken, refreshToken);
      res.status(200).json({
        success: true,
        message: "Token Refresh Successfully!",
        accessToken: accessToken,
      });
    }
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

export const createUserProfile = async (req: Request, res: Response) => {
  try {
    const validate = profileValidate.safeParse({
      userId: req.user?.userId,
      cus_add: req.body.cus_add,
      cus_city: req.body.cus_city,
      cus_country: req.body.cus_country,
      cus_fax: req.body.cus_fax,
      cus_name: req.body.cus_name,
      cus_phone: req.body.cus_phone,
      cus_postcode: req.body.cus_postcode,
      cus_state: req.body.cus_state,
      ship_add: req.body.ship_add,
      ship_city: req.body.ship_city,
      ship_country: req.body.ship_country,
      ship_fax: req.body.ship_fax,
      ship_name: req.body.ship_name,
      ship_phone: req.body.ship_phone,
      ship_postcode: req.body.ship_postcode,
    });

    if (!validate.success) {
      res.status(400).json({
        success: false,
        errorType: "dto",
        message: validate.error.flatten().fieldErrors,
      });
    }
    const data = validate.data as ProfileDto;
    const existProfile = await UserProfile.findOne({
      userId: req.user?.userId,
    });
    if (existProfile) {
      res.status(400).json({
        success: false,
        errorType: "exist",
        message: "User Profile Already Exist!",
      });
    }

    const createProfile = await UserProfile.create({
      userId: req.user?.userId,
      cus_add: data.cus_add,
      cus_city: data.cus_city,
      cus_country: data.cus_country,
      cus_fax: data.cus_fax,
      cus_name: data.cus_name,
      cus_phone: data.cus_phone,
      cus_postcode: data.cus_postcode,
      cus_state: data.cus_state,
      ship_add: data.ship_add,
      ship_city: data.ship_city,
      ship_country: data.ship_country,
      ship_fax: data.ship_fax,
      ship_name: data.ship_name,
      ship_phone: data.ship_phone,
      ship_postcode: data.ship_postcode,
    });
    if (!createProfile) {
      res.status(400).json({
        success: false,
        errorType: "createProfile",
        message: "Something Went Wrong Profile Not Created!",
      });
    }
    res.status(400).json({
      success: true,
      message: "User Profile Created Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorType: "server",
      message: error,
    });
  }
};
