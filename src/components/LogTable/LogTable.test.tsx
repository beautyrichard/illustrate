import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogTable from "./LogTable";
import { LogContext } from "../../context/LogContext";
import ResizeObserver from "resize-observer-polyfill";
import { LogType } from "../../hooks/useFetchLogs";
import { LogEntryProps } from "../LogEntry/LogEntry";
import { waitFor } from "@testing-library/react";

// Mock ResizeObserver since it's used in the component
global.ResizeObserver = ResizeObserver;

const mockLogs = [
  {
    _time: 1724323612592,
    cid: "api",
    channel: "conf:policies",
    level: "info",
    message: "loading policy",
    context: "cribl"
  },
  {
    _time: 1724323576596,
    cid: "api",
    channel: "ShutdownMgr",
    level: "info",
    message: "Shutdown:CB:Complete",
    name: "ServiceRpcMgr.master"
  },
  {
    _time: 1724323540596,
    cid: "api",
    channel: "telemetry",
    level: "error",
    message: "failed to report search product usage",
    error: { message: "Unknown product search" }
  },
  {
    _time: 1724323504596,
    cid: "api",
    channel: "gitmgr",
    level: "info",
    message: "initializing git mgr"
  },
  {
    _time: 1724323468596,
    cid: "api",
    channel: "Roles",
    level: "info",
    message: "resolving role policies",
    role: "__system_search_results__"
  }
  // Add more logs as needed... should render
];

// Mock LogEntry component to focus on LogTable behavior
jest.mock(
  "../LogEntry/LogEntry",
  (): React.FC<LogEntryProps> =>
    ({ log, isExpanded, onToggle, isEven }) =>
      (
        <div data-testid="log-entry">
          <p>Time: {new Date(log._time).toISOString()}</p>
          <p>Message: {log.message}</p>
          <p>Expanded: {isExpanded ? "true" : "false"}</p>
          <p>Even: {isEven ? "true" : "false"}</p>
        </div>
      )
);

describe("LogTable Component", () => {
  const renderLogTable = () =>
    render(
      <LogContext.Provider value={{ logs: mockLogs, error: null }}>
        <LogTable />
      </LogContext.Provider>
    );

  it('should render "Time" and "Event" column headers', () => {
    renderLogTable();

    const timeColumn = screen.getByRole("columnheader", { name: /time/i });
    const eventColumn = screen.getByRole("columnheader", { name: /event/i });

    expect(timeColumn).toBeInTheDocument();
    expect(eventColumn).toBeInTheDocument();
  });

  it("should render logs using virtualization", () => {
    renderLogTable();

    // Assuming a row height of 32px (as per the getItemSize default) and a viewport height equal to window.innerHeight
    const rowHeight = 32; // Default row height
    const viewportHeight = window.innerHeight;
    const maxVisibleLogs = Math.floor(viewportHeight / rowHeight); // Calculate maximum visible logs based on the viewport

    // Check that log entries are rendered and ensure virtualization is working
    const logEntries = screen.getAllByTestId("log-entry");

    // Ensure that the number of rendered entries does not exceed the maximum visible logs
    expect(logEntries.length).toBeLessThanOrEqual(maxVisibleLogs);

    // Ensure that at least one log entry is rendered (i.e., virtualization is not hiding all logs)
    expect(logEntries.length).toBeGreaterThan(0);
  });

  it("should correctly display the log details", () => {
    renderLogTable();

    // Check if the first log is rendered correctly
    const logEntry1 = screen.getByText(/Time: 2024-08-22T10:46:52.592Z/i);
    const logEntry2 = screen.getByText(/Message: loading policy/i);

    expect(logEntry1).toBeInTheDocument();
    expect(logEntry2).toBeInTheDocument();
  });
});
