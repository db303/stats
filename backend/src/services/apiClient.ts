import fetch from "node-fetch";
import { ZodError } from "zod";
import { REGIONS, Region } from "../config/endpoints";
import { ApiResponse, ApiResponseSchema } from "../types/api";
import {
  ApiError,
  ApiTimeoutError,
  ApiNetworkError,
  ApiResponseError,
  ApiValidationError,
} from "../types/errors";

export interface ApiClientConfig {
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async fetchRegionData(region: Region): Promise<ApiResponse> {
    const url = REGIONS[region];

    if (!url) {
      throw new ApiValidationError(region, `Unknown region: ${region}`);
    }

    let lastError: ApiError;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await this.makeRequest(region, url);
      } catch (error) {
        lastError = error as ApiError;

        if (lastError.type === "validation" || lastError.type === "response") {
          throw lastError;
        }

        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay);
        }
      }
    }

    throw lastError!;
  }

  private async makeRequest(region: Region, url: string): Promise<ApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiResponseError(
          region,
          response.status,
          response.statusText
        );
      }

      const data = await response.json();

      try {
        return ApiResponseSchema.parse(data);
      } catch (error) {
        if (error instanceof ZodError) {
          const issues = error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
          throw new ApiValidationError(
            region,
            `Schema validation failed: ${issues}`,
            error
          );
        }
        throw new ApiValidationError(region, "Unknown validation error", error);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new ApiTimeoutError(region, this.config.timeout);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiNetworkError(region, error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();
