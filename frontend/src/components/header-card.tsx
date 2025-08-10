import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface HeaderCardProps {
  status: boolean;
  region: string;
  version: string;
}

export function HeaderCard({ status, region, version }: HeaderCardProps) {
  return (
    <Card>
      <CardContent className="px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge variant={status ? "default" : "destructive"}>
              {status ? "OK" : "Offline"}
            </Badge>
            <span className="text-muted-foreground">{region}</span>
          </div>
          <span className="text-muted-foreground">{version}</span>
        </div>
      </CardContent>
    </Card>
  );
}
