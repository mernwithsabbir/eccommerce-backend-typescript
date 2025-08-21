import { config as conf } from "dotenv";

conf();

const _config = {
  PORT: process.env.PORT || 8000,
};

const config = Object.freeze(_config);
export default config;
