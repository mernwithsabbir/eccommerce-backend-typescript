import { config as conf } from "dotenv";

conf();

const _config = {
  PORT: process.env.PORT || 8000,
  MONGO_URI: process.env.MONGO_URI as string,
  NODE_ENV: process.env.NODE_ENV || "development",
  DOMAIN: process.env.DOMAIN || undefined,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};

const config = Object.freeze(_config);
export default config;
