import { Server } from "socket.io";
import { createServer } from "http";
import {
  initializeRegions,
  handleConnection,
  startPeriodicFetching,
} from "./services/socketService";

const PORT = 3000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeRegions();
io.on("connection", handleConnection());
startPeriodicFetching(io);

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
