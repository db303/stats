import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { type ReactNode } from "react";

interface HeaderCardProps {
  status: boolean;
  region: string;
  version: string;
  children?: ReactNode;
}

export function HeaderCard({ status, version, children }: HeaderCardProps) {
  return (
    <Card>
      <CardContent className="px-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Badge variant={status ? "default" : "destructive"}>
              {status ? "OK" : "Offline"}
            </Badge>
            <span className="text-muted-foreground">Version: {version}</span>
          </div>
          <div className="flex items-center gap-4">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}
