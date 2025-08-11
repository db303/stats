// Note: This file imports from 'zod' which must be available in the consuming project
import { z } from "zod";

export const WorkerQueueSchema = z.object({
  wait_time: z.number(),
  workers: z.number(),
  waiting: z.number(),
  idle: z.number(),
  time_to_return: z.number(),
  recently_blocked_keys: z.array(z.tuple([z.string(), z.number(), z.string()])),
  top_keys: z.array(z.tuple([z.string(), z.number()])),
});

export const ServerInfoSchema = z.object({
  cpus: z.number(),
  active_connections: z.number(),
  wait_time: z.number(),
  workers: z.array(z.tuple([z.string(), WorkerQueueSchema])),
  cpu_load: z.number(),
  timers: z.number(),
});

export const ServerStatsSchema = z.object({
  servers_count: z.number(),
  online: z.number(),
  session: z.number(),
  server: ServerInfoSchema,
});

export const ServiceStatusSchema = z.object({
  redis: z.boolean(),
  database: z.boolean(),
});

export const ResultsSchema = z.object({
  services: ServiceStatusSchema,
  stats: ServerStatsSchema,
});

export const ApiResponseSchema = z.object({
  status: z.string(),
  region: z.string(),
  roles: z.array(z.string()),
  results: ResultsSchema,
  strict: z.boolean(),
  server_issue: z.string().nullable(),
  version: z.string(),
});

export const WorkerQueueNameSchema = z.enum([
  "requests:pageviews",
  "io",
  "requests:unsupported-users",
  "recording-workers",
]);

export const WorkerQueueDataSchema = z.object({
  name: WorkerQueueNameSchema,
  data: WorkerQueueSchema,
});

export type WorkerQueue = z.infer<typeof WorkerQueueSchema>;
export type ServerInfo = z.infer<typeof ServerInfoSchema>;
export type ServerStats = z.infer<typeof ServerStatsSchema>;
export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;
export type Results = z.infer<typeof ResultsSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type WorkerQueueName = z.infer<typeof WorkerQueueNameSchema>;
export type WorkerQueueData = z.infer<typeof WorkerQueueDataSchema>;