import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlockedKeysTableProps {
  blockedKeys: [string, number, string][];
}

export function BlockedKeysTable({ blockedKeys }: BlockedKeysTableProps) {
  if (blockedKeys.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recently Blocked Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No blocked keys</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recently Blocked Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {blockedKeys.map(([key, duration, timestamp], index) => (
            <div key={index} className="flex flex-col space-y-1 py-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm">{key}</div>
                <div className="text-sm">{duration.toLocaleString()} ms</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}