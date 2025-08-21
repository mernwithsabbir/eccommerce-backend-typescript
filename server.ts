import app from "./src/app";
import config from "./src/config/config";

const server = async () => {
  app.listen(config.PORT, () => {
    console.log(
      `Server Running Successfully at : http://localhost:${config.PORT}/`
    );
  });
};
server();
