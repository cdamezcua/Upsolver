import io from "socket.io-client";

export const socket = io("http://localhost:3002", {
  transports: ["websocket"],
  autoConnect: false,
});
