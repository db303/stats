import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config";
import {
  handleConnection,
  startPeriodicFetching,
} from "./services/socketService";

const PORT = process.env.PORT || 3000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", handleConnection());
startPeriodicFetching(io);

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
