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
const AuthRoutes = require("./api/v1/routes/auth_routes");
const { TaskRoutes } = require("./api/v1/routes/task_routes");
const { UserRoutes } = require("./api/v1/routes/user_routes");
const { DepartmentsRoutes } = require("./api/v1/routes/department_route");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

//init db
const db = new Database();
//init routes
app.use("/v1/auth", AuthRoutes);
app.use("/v1/tasks", TaskRoutes);
app.use("/v1/users", UserRoutes);
app.use("/v1/departments", DepartmentsRoutes);
// handle error
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    code: 404,
    messages: "Not Found",
  });
});

//
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
