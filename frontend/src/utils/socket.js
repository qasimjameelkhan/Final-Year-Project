// lib/socket.ts
import { io } from "socket.io-client";

const socket = io(
  process.env.REACT_PUBLIC_SOCKET_URL || "http://localhost:9000",
  {
    transports: ["websocket"],
  }
);

export default socket;
