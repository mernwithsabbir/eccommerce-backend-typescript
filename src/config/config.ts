import { config as conf } from "dotenv";

conf();

const _config = {
  PORT: process.env.PORT || 8000,
  MONGO_URI: process.env.MONGO_URI as string,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};

const config = Object.freeze(_config);
export default config;
