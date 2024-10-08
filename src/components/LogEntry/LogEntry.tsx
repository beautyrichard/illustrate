import React, { useRef } from "react";
import "./LogEntry.css";
import { LogType } from "../../hooks/useFetchLogs";

export interface LogEntryProps {
  log: LogType;
  isExpanded?: boolean;
  onToggle: () => void;
  isEven: boolean;
}

const LogEntry: React.FC<LogEntryProps> = ({
  log,
  isExpanded,
  onToggle,
  isEven
}) => {
  const entryRef = useRef<HTMLDivElement>(null); // Reference to the log entry element
  const contentRef = useRef<HTMLDivElement>(null);
  const logId = `log-row-${log._time}`;
  const detailId = `log-detail-${log._time}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent default scrolling behavior when pressing Space
      onToggle(); // Toggle the expanded/collapsed state

      // Focus back on the log entry after toggling
      if (entryRef.current) {
        entryRef.current.focus();
      }
    }
  };

  return (
    <div
      ref={entryRef} // Reference the div for managing focus
      className={`log-entry ${isExpanded ? "expanded" : ""} ${
        isEven ? "even" : "odd"
      }`}
      role="button"
      aria-expanded={isExpanded}
      aria-controls={detailId}
      tabIndex={0} // Ensures the element is focusable
      onClick={() => {
        onToggle();
        if (entryRef.current) {
          entryRef.current.focus(); // Ensure focus remains after click
        }
      }} // Toggle on click and retain focus
      onKeyDown={handleKeyDown} // Toggle on Enter or Space key press and retain focus
      data-testid="log-entry"
      aria-labelledby={logId}
    >
      {/* Summary of the log, the clickable element */}
      <div className="log-summary" style={{ cursor: "pointer" }}>
        <div className="log-summary-left" id={logId}>
          {/* Arrow indicating expanded/collapsed state */}
          <span
            className={`arrow ${isExpanded ? "expanded" : ""}`}
            aria-hidden="true" // Mark as decorative
          >
            {"▶"}
          </span>
          {/* Log timestamp */}
          <span>{new Date(log._time).toISOString()}</span>
        </div>

        {/* Display log content summary */}
        <div className="log-summary-right">
          <span>"{JSON.stringify(log)}"</span>
        </div>
      </div>

      {/* Expandable log details */}
      {isExpanded && (
        <div
          className="log-detail"
          ref={contentRef}
          id={detailId}
          aria-labelledby={logId}
          role="region" // Define this as a region for assistive technology
        >
          <pre>{JSON.stringify(log, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LogEntry;
