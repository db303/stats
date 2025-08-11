import type { ApiResponse } from "./api";

export interface ServerData {
  region: string;
  data: ApiResponse;
  timestamp: string;
}

export interface RegionStatus {
  regions: Record<string, "healthy" | "error" | "unknown">;
}

export interface WebSocketError {
  region?: string;
  error?: string;
  message: string;
}

export interface ClientToServerEvents {
  "subscribe-region": (region: string) => void;
  "unsubscribe-region": (region: string) => void;
}

export interface ServerToClientEvents {
  data: (data: ServerData) => void;
  status: (status: RegionStatus) => void;
  error: (error: WebSocketError) => void;
}
