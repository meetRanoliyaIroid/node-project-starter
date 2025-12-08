import express from "express";
import { serve, setup } from "swagger-ui-express";
import { apiBaseUrl, APP_NAME, ENV } from "../config/constant";
import YAML from "yamljs";

const router = express.Router();
const swaggerDoc = YAML.load("swagger.yaml");

if(ENV !== "production") {
    router.use(
        "/",
        (req, res, next) => {
            swaggerDoc.info.title = APP_NAME;
            swaggerDoc.servers = [
              {
                url: apiBaseUrl(),
                description: "Base url for API's",
              },
            ];
            req.swaggerDoc = swaggerDoc;
            next();
          },
          serve,
          setup(swaggerDoc, {
            swaggerOptions: {
              persistAuthorization: true,
              docExpansion: "list",
            },
          })
    )
}

export default router;