import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopKeysTableProps {
  topKeys: [string, number][];
}

export function TopKeysTable({ topKeys }: TopKeysTableProps) {
  if (topKeys.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Keys by Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No top keys data
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedKeys = topKeys.sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Keys by Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedKeys.map(([key, usage], index) => {
            const percentage = (usage * 100).toFixed(2);

            return (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div className="font-mono text-sm">{key}</div>
                <div className="text-sm text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
