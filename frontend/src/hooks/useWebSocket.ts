import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { ServerData, RegionStatus } from "@shared/types";

interface UseWebSocketOptions {
  url: string;
}

export const useWebSocket = ({ url }: UseWebSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [regionStatus, setRegionStatus] = useState<RegionStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    socket.on("status", (data: RegionStatus) => {
      console.log("Status update:", data);
      setRegionStatus(data);
    });

    socket.on("data", (data: ServerData) => {
      console.log("Data update:", data);
      setServerData(data);
    });

    socket.on("error", (error) => {
      console.error("️Server error:", error);
    });

    return () => {
      if (currentRegion) {
        socket.emit("unsubscribe-region", currentRegion);
      }
      socket.disconnect();
      console.log("WebSocket disconnected and cleaned up");
    };
  }, [url]);

  const subscribeToRegion = useCallback((region: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    // Unsubscribe from current region if any
    if (currentRegion) {
      console.log(`Unsubscribing from region: ${currentRegion}`);
      socket.emit("unsubscribe-region", currentRegion);
    }

    // Subscribe to new region
    console.log(`Subscribing to region: ${region}`);
    socket.emit("subscribe-region", region);
    setCurrentRegion(region);
    
    // Clear previous data when switching regions
    setServerData(null);
  }, [currentRegion, isConnected]);

  return {
    socket: socketRef.current,
    serverData,
    regionStatus,
    isConnected,
    currentRegion,
    subscribeToRegion,
  };
};
