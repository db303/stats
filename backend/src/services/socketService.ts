import { Server, Socket } from "socket.io";
import { apiClient } from "./apiClient";
import { Region, REGIONS } from "../config/endpoints";
import { ApiResponse } from "../types/api";
import { ApiError } from "../types/errors";

const regionDataCache = new Map<
  Region,
  { data: ApiResponse; timestamp: number }
>();
const regionStatus = new Map<Region, "healthy" | "error" | "unknown">();
let fetchInterval: NodeJS.Timeout | null = null;

export const initializeRegions = () => {
  Object.keys(REGIONS).forEach((region) => {
    regionStatus.set(region as Region, "unknown");
  });
};

export const handleConnection = () => (socket: Socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.emit("status", {
    regions: Object.fromEntries(regionStatus),
  });

  socket.on("subscribe-region", (region: Region) => {
    handleRegionSubscription(socket, region);
  });

  socket.on("unsubscribe-region", (region: Region) => {
    handleRegionUnsubscription(socket, region);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
};

const handleRegionSubscription = (socket: Socket, region: Region) => {
  if (!REGIONS[region]) {
    socket.emit("error", { message: `Unknown region: ${region}` });
    return;
  }

  socket.join(region);
  console.log(`Client ${socket.id} subscribed to ${region}`);

  const cached = regionDataCache.get(region);
  if (cached) {
    socket.emit("data", {
      region,
      data: cached.data,
      timestamp: new Date(cached.timestamp).toISOString(),
    });
  }
};

const handleRegionUnsubscription = (socket: Socket, region: Region) => {
  socket.leave(region);
  console.log(`Client ${socket.id} unsubscribed from ${region}`);
};

export const startPeriodicFetching = (
  io: Server,
  intervalMs: number = 30000
) => {
  fetchInterval = setInterval(() => {
    fetchAllRegionsData(io);
  }, intervalMs);

  fetchAllRegionsData(io);
  console.log(`Started periodic fetching every ${intervalMs}ms`);
};

export const stopPeriodicFetching = () => {
  if (fetchInterval) {
    clearInterval(fetchInterval);
    fetchInterval = null;
    console.log("Stopped periodic fetching");
  }
};

const fetchAllRegionsData = async (io: Server) => {
  const regions = Object.keys(REGIONS) as Region[];

  for (const region of regions) {
    try {
      const data = await apiClient.fetchRegionData(region);
      const timestamp = Date.now();

      regionDataCache.set(region, { data, timestamp });
      regionStatus.set(region, "healthy");

      io.to(region).emit("data", {
        region,
        data,
        timestamp: new Date(timestamp).toISOString(),
      });
    } catch (error) {
      regionStatus.set(region, "error");
      const errorMessage =
        error instanceof ApiError ? error.message : "Unknown error";

      console.error(`Error fetching ${region}:`, errorMessage);

      io.to(region).emit("error", {
        region,
        error: error instanceof ApiError ? error.type : "unknown",
        message: errorMessage,
      });
    }
  }

  io.emit("status", {
    regions: Object.fromEntries(regionStatus),
  });
};
