import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { IUserInterface } from "../models/UserModel";
import config from "../config/config";

export const signAccessToken = (user: IUserInterface) => {
  const payload = {
    userId: user._id?.toString(),
    email: user.email,
    isVerified: user.isVerified,
    role: user.role,
  };

  return jwt.sign(
    payload,
    config.JWT_SECRET as string,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN } as SignOptions
  );
};
export const signRefreshToken = (user: IUserInterface, jti: string) => {
  const payload = {
    userId: user._id?.toString(),
    jti: jti,
    role: user.role,
  };

  return jwt.sign(
    payload,
    config.JWT_SECRET as string,
    { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN } as SignOptions
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET as string);
};
export const newJti = () => {
  return uuidv4();
};
