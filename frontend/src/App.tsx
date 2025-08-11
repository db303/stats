import { useState, useEffect } from "react";
import { StatsCard } from "@/components/stats-card";
import { StatusCard } from "@/components/status-card";
import { HeaderCard } from "@/components/header-card";
import { RegionSelect } from "@/components/region-select";
import { WorkerQueueDetails } from "@/components/worker-queue-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebSocket } from "@/hooks/useWebSocket";

const queueDisplayNames: Record<string, string> = {
  "requests:pageviews": "Page Views",
  io: "I/O Operations",
  "requests:unsupported-users": "Unsupported Users",
  "recording-workers": "Recording Workers",
};

function App() {
  const [selectedRegion, setSelectedRegion] = useState("us-west");
  const { serverData, isConnected, currentRegion, subscribeToRegion } =
    useWebSocket({
      url: import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3000",
    });

  useEffect(() => {
    if (isConnected && !currentRegion) {
      subscribeToRegion(selectedRegion);
    }
  }, [isConnected, currentRegion, selectedRegion, subscribeToRegion]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    subscribeToRegion(region);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Connecting to server...</div>
      </div>
    );
  }

  if (!serverData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">
          {currentRegion
            ? `Loading data for ${selectedRegion}...`
            : "Connecting..."}
        </div>
      </div>
    );
  }

  const { data } = serverData;
  const stats = data.results.stats;
  const services = data.results.services;

  return (
    <div>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <div className="flex flex-col gap-4">
          <HeaderCard
            status={isConnected}
            region={data.region}
            version={data.version}
          >
            <RegionSelect
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
              disabled={!isConnected}
            />
          </HeaderCard>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard value={stats.online.toString()} label="Online Users" />
            <StatsCard
              value={stats.server.active_connections.toString()}
              label="Active Connections"
            />
            <StatsCard
              value={`${Math.round(stats.server.cpu_load * 100)}%`}
              label="CPU Load"
            />
            <StatsCard
              value={stats.session.toString()}
              label="Active Sessions"
            />
            <StatsCard
              value={`${stats.server.wait_time.toString()} ms`}
              label="Wait Time"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatusCard service="Database" status={services.database} />
            <StatusCard service="Redis" status={services.redis} />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <Tabs
          defaultValue={stats.server.workers[0]?.[0] || "io"}
          className="w-full gap-0"
        >
          <TabsList className="grid w-full grid-cols-4">
            {stats.server.workers.map(([queueName, queueData]) => {
              const isActive = queueData.workers > 0 || queueData.waiting > 0;
              return (
                <TabsTrigger
                  key={queueName}
                  value={queueName}
                  className="text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {queueDisplayNames[queueName] || queueName}
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {stats.server.workers.map(([queueName, queueData]) => (
            <TabsContent key={queueName} value={queueName} className="mt-6">
              <WorkerQueueDetails queueData={queueData} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}

export default App;
