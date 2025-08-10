import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkerCardProps {
  title: string;
  waitTime: number;
  waiting: number;
  workers: number;
  idle: number;
}

export function WorkerCard({
  title,
  waitTime,
  waiting,
  workers,
  idle,
}: WorkerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Avg. Wait Time</span>
          <span className="font-medium">{waitTime}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Waiting</span>
          <span className="font-medium">{waiting}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Workers</span>
          <span className="font-medium">{workers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Idle Workers</span>
          <span className="font-medium">{idle}</span>
        </div>
      </CardContent>
    </Card>
  );
}
