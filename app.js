import express from "express";
import router from "./routes/index";
import fs from "fs";
import http from "http";
import modelsAllRelations from "./model";
import { PORT, IS_SECURE, JWT, ENV } from "./src/config/constant";
import swagger from "./src/config/swagger";
import errorHandler from "./src/middleware/errorHandler";
import passport from "passport";
import session from "express-session";
import "./src/config/jwtStrategy";
import path from "path";
import cronTask from "./cron/index";
import seed from "./src/seeder";
// import io from "./src/chat/chat.connection"; // for chat connection
import dotenv from "dotenv";
import runChecklist from "./serverCheckList";
dotenv.config();

// Run checklist
runChecklist();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(express.static(`${__dirname}/public`));

app.use(
  session({ secret: JWT.SECRET, resave: "false", saveUninitialized: "true" })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/documentation", swagger);
app.use("/", router);

app.use(errorHandler);

const server = http.Server(app);
// io.attach(server) // for chat connection

// Run cron
if (ENV != "local") {
  cronTask();
}

modelsAllRelations.sequelize.sync({ alter: true }).then(() => {
  if (IS_SECURE == "true") {
    var options = {
      key: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/privkey.pem`),
      cert: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
      ca: [
        fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
        fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/fullchain.pem`),
      ],
    };
    var https = require("https").Server(options, app);

    https.listen(PORT, () => {
      console.log(
        `Https server is running on https://${process.env.HOST}:${PORT}`
      );
    });

    // Seed data
    seed();
  } else {
    server.listen(PORT, () => {
      console.log(`Your application is running on ${PORT}`);
    });

    // Seed data
    seed();
  }
});
