import { CookieOptions, Response } from "express";
import config from "../config/config";
import { Duration, parseDuration } from "@alwatr/parse-duration";

const setCookieOption = () => {
  const isProd = config.NODE_ENV === "production";
  const domain = config.DOMAIN;

  return <CookieOptions>{
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "lax",
    domain: domain,
    path: "/",
  };
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const accessExp = parseDuration(config.ACCESS_TOKEN_EXPIRES_IN as Duration);
  const refreshExp = parseDuration(config.REFRESH_TOKEN_EXPIRES_IN as Duration);

  res.cookie("accessToken", accessToken, {
    ...setCookieOption(),
    maxAge: accessExp,
  });
  res.cookie("refreshToken", refreshToken, {
    ...setCookieOption(),
    maxAge: refreshExp,
  });
};
export const clearAuthCookie = (res: Response) => {
  res.clearCookie("accessToken", setCookieOption());
  res.clearCookie("refreshToken", setCookieOption());
};
