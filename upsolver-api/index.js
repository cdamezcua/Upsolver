import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { FRONT_END_BASE_URL } from "./constants/urls.js";
import { PORT, SOCKET_PORT } from "./constants/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { InvalidatedJWT } from "./models/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: FRONT_END_BASE_URL,
    credentials: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: FRONT_END_BASE_URL,
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: [!] Token missing."));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const denylisted = await InvalidatedJWT.findOne({ where: { token } });
    if (denylisted) {
      return next(new Error("Authentication error: [!] Token denylisted."));
    }
    socket.decodedToken = decodedToken;
    next();
  } catch (err) {
    return next(
      new Error("Authentication error: [!] Invalid or expired token.")
    );
  }
});

io.on("connection", (socket) => {
  socket.on("join", async (room) => {
    socket.join(room.id);
  });

  socket.on("message", (message) => {
    io.to(message.roomId).emit("message", message);
  });

  socket.on("leave", (room) => {
    socket.leave(room.id);
  });

  socket.on("disconnect", () => {});
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

httpServer.listen(3002, () => {
  console.log(`Listening on port ${SOCKET_PORT}`);
});
