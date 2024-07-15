const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const Database = require("./dbs/init.postgresql.lv0");
const cors = require("cors");
const axios = require("axios");
const {
  BadRequestError,
  ConflictRequestError,
} = require("./core/error.response");
const { runSocket, io } = require("./socket/socket");

const path = require("path");
const AuthRoutes = require("./api/v1/routes/auth_routes");
const { TaskRoutes } = require("./api/v1/routes/task_routes");
const { UserRoutes } = require("./api/v1/routes/user_routes");
const { DepartmentsRoutes } = require("./api/v1/routes/department_route");
const { RoleRoutes } = require("./api/v1/routes/role_routes");
const {
  RolePermissionRoutes,
} = require("./api/v1/routes/role_permissions_route");
const { NotificationRoutes } = require("./api/v1/routes/notification_route");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
//socket io
// const server = http.createServer(app);

// // Tích hợp Socket.IO
// runSocket();
// io.attach(server);
//

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
app.use("/v1/roles", RoleRoutes);
app.use("/v1/rolePermissions", RolePermissionRoutes);
app.use("/v1/notification", NotificationRoutes);
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
// Trong file chính của ứng dụng Express, thêm:
app.get("/v1/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is healthy" });
});

process.on("SIGINT", async () => {
  await db.disconnect();
  console.log("Application terminated, database connection closed.");
  process.exit(0);
});

const url = "https://task-management-be-ssq1.onrender.com/v1/health"; // Đường dẫn tới điểm endpoint kiểm tra sức khỏe của server

function pingServer() {
  console.log("Pinging server...");
  axios
    .get(url)
    .then((response) => {
      console.log("Server response:", response.data);
    })
    .catch((error) => {
      console.error("Error pinging server:", error);
    });
}

// Hàm setInterval để gọi hàm pingServer mỗi 300000 milliseconds (5 minutes)
setInterval(pingServer, 300000); // Đổi số này để thay đổi khoảng thời gian giữa các lần ping
module.exports = app;
