const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

const runSocket = () => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = { io, runSocket };
