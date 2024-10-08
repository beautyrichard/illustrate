import React from "react";
import { LogProvider } from "./context/LogContext";
import LogViewer from "./pages/LogViewer";
import "./App.css";

const App: React.FC = () => {
  return (
    <LogProvider>
      <LogViewer />
    </LogProvider>
  );
};

export default App;
