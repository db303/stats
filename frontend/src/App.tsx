import { StatsCard } from "@/components/stats-card";
import { StatusCard } from "@/components/status-card";
import { WorkerCard } from "@/components/worker-card";
import { HeaderCard } from "@/components/header-card";

const queues = [
  {
    title: "Page Views",
    idle: 1,
    waitTime: 1,
    waiting: 45,
    workers: 40,
  },
  { title: "I/O Operations", idle: 1, waitTime: 1, waiting: 45, workers: 40 },
  {
    title: "Unsupported Users",
    idle: 1,
    waitTime: 1,
    waiting: 45,
    workers: 40,
  },
  {
    title: "Recording Workers",
    idle: 1,
    waitTime: 1,
    waiting: 45,
    workers: 40,
  },
];

function App() {
  return (
    <div>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <div className="flex flex-col gap-4">
          <HeaderCard status={true} region="eu-west-2" version="v.0.0.1" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard value="10175" label="Online Users" />
            <StatsCard value="335" label="Active Connections" />
            <StatsCard value="75" label="CPU Load" />
            <StatsCard value="15" label="Active Sessions" />
            <StatsCard value="100" label="Timers" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatusCard service="Database" status={false} />
            <StatusCard service="Redis" status={true} />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <h1 className="mb-4 text-xl font-semibold tracking-tight md:text-2xl">
          Worker Queues
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {queues.map((queue, index) => (
            <WorkerCard key={index} {...queue} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
