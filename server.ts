import app from "./src/app";
import config from "./src/config/config";
import connectDB from "./src/config/db";

const server = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(
      `Server Running Successfully at : http://localhost:${config.PORT}/`
    );
  });
};
server();
