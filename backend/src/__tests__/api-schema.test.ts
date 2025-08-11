import { describe, it, expect } from "vitest";
import {
  ApiResponseSchema,
  WorkerQueueSchema,
  ServiceStatusSchema,
  WorkerQueueNameSchema,
} from "../types/api";

describe("API Schema Validation", () => {
  describe("ApiResponseSchema", () => {
    it("should parse valid API response", () => {
      const validResponse = {
        status: "ok",
        region: "us-east",
        roles: ["socket"],
        results: {
          services: {
            redis: true,
            database: true,
          },
          stats: {
            servers_count: 2,
            online: 6835,
            session: 16,
            server: {
              cpus: 2,
              active_connections: 4428,
              wait_time: 1179,
              workers: [
                [
                  "io",
                  {
                    wait_time: 1179,
                    workers: 2459,
                    waiting: 30,
                    idle: 245,
                    time_to_return: 27204,
                    recently_blocked_keys: [
                      ["3FG7RD4yF6", 8215, "2025-08-10T17:07:11.614Z"],
                    ],
                    top_keys: [
                      ["3FG7RD4yF6", 0.12575127138233935],
                      ["Bvy5aLQrQE", 0.10124826629680998],
                    ],
                  },
                ],
              ],
              cpu_load: 0.59,
              timers: 100,
            },
          },
        },
        strict: false,
        server_issue: null,
        version: "2025.7.8",
      };

      expect(() => ApiResponseSchema.parse(validResponse)).not.toThrow();

      const parsed = ApiResponseSchema.parse(validResponse);

      expect(parsed.region).toBe("us-east");
      expect(parsed.status).toBe("ok");
    });

    it("should reject response missing required fields", () => {
      const invalidResponse = {
        status: "ok",
        region: "us-east",
      };

      expect(() => ApiResponseSchema.parse(invalidResponse)).toThrow();
    });

    it("should reject response with wrong field types", () => {
      const invalidResponse = {
        status: "ok",
        region: "us-east",
        roles: "socket", // should be array
        results: {
          services: { redis: true, database: true },
          stats: {
            servers_count: "2", // should be number
            online: 6835,
            session: 16,
            server: {
              cpus: 2,
              active_connections: 4428,
              wait_time: 1179,
              workers: [],
              cpu_load: 0.59,
              timers: 100,
            },
          },
        },
        strict: false,
        server_issue: null,
        version: "2025.7.8",
      };

      expect(() => ApiResponseSchema.parse(invalidResponse)).toThrow();
    });
  });

  describe("WorkerQueueSchema", () => {
    it("should parse valid worker queue data", () => {
      const validWorker = {
        wait_time: 1179,
        workers: 2459,
        waiting: 30,
        idle: 245,
        time_to_return: 27204,
        recently_blocked_keys: [
          ["3FG7RD4yF6", 8215, "2025-08-10T17:07:11.614Z"],
        ],
        top_keys: [["3FG7RD4yF6", 0.12575127138233935]],
      };

      expect(() => WorkerQueueSchema.parse(validWorker)).not.toThrow();
    });

    it("should reject worker queue with invalid tuple format", () => {
      const invalidWorker = {
        wait_time: 1179,
        workers: 2459,
        waiting: 30,
        idle: 245,
        time_to_return: 27204,
        recently_blocked_keys: [
          ["key", "not-a-number", "date"], // middle should be number
        ],
        top_keys: [["key", 0.123]],
      };

      expect(() => WorkerQueueSchema.parse(invalidWorker)).toThrow();
    });
  });

  describe("ServiceStatusSchema", () => {
    it("should parse valid service status", () => {
      const validStatus = {
        redis: true,
        database: false,
      };

      expect(() => ServiceStatusSchema.parse(validStatus)).not.toThrow();
    });

    it("should reject non-boolean service status", () => {
      const invalidStatus = {
        redis: "true", // should be boolean
        database: false,
      };

      expect(() => ServiceStatusSchema.parse(invalidStatus)).toThrow();
    });
  });

  describe("WorkerQueueNameSchema", () => {
    it("should accept valid worker queue names", () => {
      const validNames = [
        "requests:pageviews",
        "io",
        "requests:unsupported-users",
        "recording-workers",
      ];

      validNames.forEach((name) => {
        expect(() => WorkerQueueNameSchema.parse(name)).not.toThrow();
      });
    });

    it("should reject invalid worker queue names", () => {
      const invalidNames = ["unknown-worker", "invalid", ""];

      invalidNames.forEach((name) => {
        expect(() => WorkerQueueNameSchema.parse(name)).toThrow();
      });
    });
  });
});
