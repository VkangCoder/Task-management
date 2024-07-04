const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const Database = require("./dbs/init.postgresql.lv0");
const cors = require("cors");
const {
  BadRequestError,
  ConflictRequestError,
} = require("./core/error.response");
const path = require("path");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

//init db
const db = new Database();
//
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
//handle error
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    code: 404,
    messages: "Not Found",
  });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  return res.status(status).json({
    status: "error",
    code: status,
    messages: error.message || "Internal Server Error",
  });
});

process.on("SIGINT", async () => {
  await db.disconnect();
  console.log("Application terminated, database connection closed.");
  process.exit(0);
});
module.exports = app;
