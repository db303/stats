import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  value: string;
  label: string;
}

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <Card role="group">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div
            className="text-3xl font-semibold tracking-tight sm:text-4xl tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
