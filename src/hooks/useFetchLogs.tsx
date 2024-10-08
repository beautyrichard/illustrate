import { useState, useEffect } from "react";

// Define the log entry structure using an interface
export interface LogType {
  _time: number;
  cid: string;
  channel: string;
  level: string;
  message: string;
  [key: string]: any; // Other optional fields
}

// Custom hook to handle fetching logs
const useFetchLogs = () => {
  const [logs, setLogs] = useState<LogType[]>([]); // Logs are of type LogType[]
  const [error, setError] = useState<string | null>(null); // Error is either a string or null

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let logsArray: LogType[] = []; // Initialize as LogType[]
        let done = false;
        let leftover = ""; // Handle incomplete JSON from the previous chunk

        while (!done) {
          const { value, done: streamDone } = await reader!.read();
          done = streamDone;

          const chunk = decoder.decode(value, { stream: !done });
          const combinedChunk = leftover + chunk;
          const lines = combinedChunk.split("\n");

          // Handle leftover for incomplete lines
          leftover = lines.pop() || "";

          const newLogs = lines
            .filter(Boolean)
            .map((line) => {
              try {
                return JSON.parse(line) as LogType; // Parse each line as LogType
              } catch {
                return null; // Handle failed JSON.parse safely
              }
            })
            .filter((log): log is LogType => log !== null); // Type guard for filtering non-null values

          logsArray = [...logsArray, ...newLogs];
          setLogs(logsArray); // Update logs incrementally as they arrive
        }

        // Handle leftover after the stream is done
        if (leftover) {
          try {
            const finalLog = JSON.parse(leftover) as LogType; // Parse the leftover as LogType
            logsArray = [...logsArray, finalLog];
            setLogs(logsArray); // Update with the final log
          } catch {
            console.error("Failed to parse leftover JSON", leftover);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchLogs();
  }, []); // Run only once on component mount

  return { logs, error };
};

export default useFetchLogs;
