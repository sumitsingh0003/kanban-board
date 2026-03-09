import { io } from "socket.io-client";

export const socket = io(
  "https://kanban-board-api-zsyw.onrender.com",
  {
    transports:["websocket"]
  }
);
