import { CardContent, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatusCardProps {
  service: string;
  status: boolean;
}

export function StatusCard({ service, status }: StatusCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          <span className="font-medium">{service}</span>
          {status ? (
            <Badge>Online</Badge>
          ) : (
            <Badge variant="destructive">Offline</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
