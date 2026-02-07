import express from "express";
import { asyncHandler } from "./async.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const app = express();
const server = createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for message from client
  socket.on("chatMessage", (msg) => {
    console.log("Message received:", msg);

    // Send message back to all connected clients
    io.emit("chatMessage", msg);
  });

  // When client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ message: "I am tanveer and I have complete BCA" });
  }),
);

app.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.json({ message: "Hello World!" });
  }),
);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

server.listen(3050, () => {
  console.log("Server is running on port 3050");
});
