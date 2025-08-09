import { useState } from "react";
import "./App.css";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <h1>Vite + React</h1>
      </CardHeader>
      <CardContent>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </CardContent>
      <CardFooter>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </CardFooter>
    </Card>
  );
}

export default App;
