import React, { useContext } from "react";
import Header from "../components/Header/Header";
import Timeline from "../components/Timeline/Timeline";
import LogTable from "../components/LogTable/LogTable";
import { LogContext, LogContextType } from "../context/LogContext"; // Import LogContext with correct types

const LogViewer: React.FC = () => {
  // Now TypeScript knows that `useContext(LogContext)` returns LogContextType
  const { error } = useContext(LogContext) as LogContextType;

  return (
    <div className="log-viewer">
      <Header />
      {error && <p className="error-message">{error}</p>}
      <Timeline color="#2884d8" />
      <LogTable />
    </div>
  );
};

export default LogViewer;
