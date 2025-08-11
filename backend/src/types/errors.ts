import { Region } from "../config/endpoints";

export abstract class ApiError extends Error {
  abstract readonly type: string;
  
  constructor(
    message: string,
    public readonly region: Region,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiTimeoutError extends ApiError {
  readonly type = "timeout";
  
  constructor(region: Region, timeout: number) {
    super(`Request to ${region} timed out after ${timeout}ms`, region);
  }
}

export class ApiNetworkError extends ApiError {
  readonly type = "network";
  
  constructor(region: Region, originalError: unknown) {
    super(`Network error fetching data from ${region}`, region, originalError);
  }
}

export class ApiResponseError extends ApiError {
  readonly type = "response";
  
  constructor(region: Region, status: number, statusText: string) {
    super(`HTTP ${status} ${statusText} from ${region}`, region);
  }
}

export class ApiValidationError extends ApiError {
  readonly type = "validation";
  
  constructor(region: Region, message: string, originalError?: unknown) {
    super(`Invalid response from ${region}: ${message}`, region, originalError);
  }
}