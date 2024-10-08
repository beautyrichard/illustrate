import React, { ReactNode, createContext, useContext } from "react";
import useFetchLogs, { LogType } from "../hooks/useFetchLogs";

// Define the shape of the context value
export interface LogContextType {
  logs: LogType[];
  error: string | null;
}

// Define LogContext and its provider
export const LogContext = createContext<LogContextType>({
  logs: [],
  error: null
}); // Use empty content as a default value

interface LogProviderProps {
  children: ReactNode;
}

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  // Use the custom hook to fetch logs and handle errors
  const { logs, error } = useFetchLogs();

  return (
    <LogContext.Provider value={{ logs, error }}>
      {children}
    </LogContext.Provider>
  );
};

// Optional helper hook to consume the LogContext more easily
export const useLogs = (): LogContextType => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogs must be used within a LogProvider");
  }
  return context;
};
