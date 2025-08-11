import { ApiResponse } from "./api";
import { Region } from "../config/endpoints";

export type MessageType = 
  | "select_region" 
  | "data" 
  | "error" 
  | "status";

export interface SelectRegionMessage {
  type: "select_region";
  region: Region;
}

export interface DataMessage {
  type: "data";
  region: Region;
  data: ApiResponse;
  timestamp: string;
}

export interface ErrorMessage {
  type: "error";
  region: Region;
  error: string;
  message?: string;
}

export interface StatusMessage {
  type: "status";
  regions: Record<Region, "healthy" | "error" | "unknown">;
}

export type ClientMessage = SelectRegionMessage;
export type ServerMessage = DataMessage | ErrorMessage | StatusMessage;