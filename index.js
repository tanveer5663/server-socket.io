import "dotenv/config";
import express from "express";
import { asyncHandler } from "./async.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 9000;
app.use(cors());
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow all origins
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Listen for message from client
//   socket.on("chatMessage", (msg) => {
//     console.log("Message received:", msg);

//     // Send message back to all connected clients
//     io.emit("chatMessage", msg);
//   });

//   // When client disconnects
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({
      message: "I am tanveer and I have complete BCA And i am learning Node.js",
    });
  }),
);

app.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.json({ message: "Hello World!" });
  }),
);

app.get(
  "/api/server-event",
  asyncHandler(async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write("data: Connected to SSE server\n\n");

    const intervalId = setInterval(() => {
      const data = {
        time: "tanveer",
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 2000);
    req.on("close", () => {
      console.log("Client disconnected");
      clearInterval(intervalId);
      res.end();
    });
  }),
);
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

server.listen(PORT, () => {
  console.log("Server is running on port 9000");
});
