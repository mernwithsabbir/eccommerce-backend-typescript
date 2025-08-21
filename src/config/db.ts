import mongoose from "mongoose";
import config from "./config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, { autoIndex: true });
    console.log("Connected Database Successfully!");
  } catch (error) {
    console.log("Database Connection Error", error);
  }
};

export default connectDB;
