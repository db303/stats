import "dotenv/config";

if (!process.env.API_URL_PATTERN || !process.env.REGIONS) {
  throw new Error("Missing API_URL_PATTERN or REGIONS in .env");
}

export const REGIONS = process.env.REGIONS.split(",").reduce(
  (map, region) => {
    const url = process.env.API_URL_PATTERN!.replace("REGION", region);
    map[region] = url;
    return map;
  },
  {} as Record<string, string>
);

export type Region = keyof typeof REGIONS;
