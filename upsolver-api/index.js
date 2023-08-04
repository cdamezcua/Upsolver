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
import { User, Role, Team, Group, Contest, Problem } from "./models/index.js";

dotenv.config();

const app = express();

app.use(cors());

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
    const getMembership = async (userId, problemId) => {
      try {
        const problems = await Problem.findAll({
          include: [
            {
              model: Contest,
              include: [
                {
                  model: Group,
                  include: [
                    {
                      model: Team,
                      include: [
                        {
                          model: Role,
                          where: { userId },
                          include: [{ model: User }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          where: { id: problemId },
        });
        return problems.length > 0;
      } catch (error) {
        return false;
      }
    };
    const userId = socket.decodedToken.user_id;
    const problemId = room.id;

    if ((await getMembership(userId, problemId)) === false) {
      return socket.emit(
        "join_error",
        `[!] You dont have access to room ${room.id}`
      );
    }
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
