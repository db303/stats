import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AVAILABLE_REGIONS = [
  { value: "eu-west", label: "Europe West" },
  { value: "eu-central", label: "Europe Central" },
  { value: "us-west", label: "US West" },
  { value: "sa-east", label: "South America East" },
  { value: "ap-southeast", label: "Asia Pacific Southeast" },
] as const;

interface RegionSelectProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  disabled?: boolean;
}

export function RegionSelect({
  selectedRegion,
  onRegionChange,
  disabled = false,
}: RegionSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedRegion}
        onValueChange={onRegionChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-48" id="region-select">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_REGIONS.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
