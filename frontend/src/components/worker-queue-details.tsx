import { Card, CardContent } from "@/components/ui/card";
import { BlockedKeysTable } from "@/components/blocked-keys-table";
import { TopKeysTable } from "@/components/top-keys-table";

interface WorkerQueueDetailsProps {
  queueData: {
    wait_time: number;
    workers: number;
    waiting: number;
    idle: number;
    time_to_return: number;
    recently_blocked_keys: [string, number, string][];
    top_keys: [string, number][];
  };
}

export function WorkerQueueDetails({ queueData }: WorkerQueueDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold">{queueData.workers}</div>
              <div className="text-sm text-muted-foreground">Workers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{queueData.waiting}</div>
              <div className="text-sm text-muted-foreground">Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{queueData.idle}</div>
              <div className="text-sm text-muted-foreground">Idle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{queueData.wait_time}</div>
              <div className="text-sm text-muted-foreground">
                Wait Time (ms)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {queueData.time_to_return > 0
                  ? queueData.time_to_return.toLocaleString()
                  : "0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Time to Return (ms)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <BlockedKeysTable blockedKeys={queueData.recently_blocked_keys} />
        <TopKeysTable topKeys={queueData.top_keys} />
      </div>
    </div>
  );
}
