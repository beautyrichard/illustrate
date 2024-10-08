import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogEntry from "./LogEntry";
import { useState } from "react";

const mockLog = {
  _time: 1724323612592, // Mock timestamp
  cid: "api",
  channel: "conf:policies",
  level: "info",
  message: "loading policy",
  context: "cribl",
  policy: {
    args: ["groupName", "macroId"],
    template: [
      "GET /m/${groupName}/search/macros/${macroId}",
      "GET /m/${groupName}/search/macros/${macroId}/*"
    ],
    description: "Members with this policy can view and use the macro",
    title: "Read Only"
  }
};

// Helper component to handle expanding/collapsing logic for testing
const LogEntryWrapper = ({ log }: { log: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <LogEntry
      log={log}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      isEven={true}
    />
  );
};

describe("LogEntry Component", () => {
  it("should expand and collapse the log details on click, with correct arrow rotation and time conversion", () => {
    // Render the LogEntry component wrapped with local state for expansion
    render(<LogEntryWrapper log={mockLog} />);

    // Initially, details should be collapsed
    const logSummary = screen.getByTestId("log-entry");
    let detailSection = screen.queryByRole("region");
    expect(detailSection).toBeNull(); // Log details should not be visible

    // Convert the mock timestamp to a readable format
    const logTime = new Date(mockLog._time).toISOString();
    expect(screen.getByText(logTime)).toBeInTheDocument(); // Time should be converted and displayed

    // Click to expand
    fireEvent.click(logSummary);
    detailSection = screen.queryByRole("region"); // Now the region with details should be visible
    expect(detailSection).toBeInTheDocument(); // Log details should appear

    // Check if arrow rotated (i.e. if it has the expanded class)
    const arrow = screen.getByText("▶");
    expect(arrow).toHaveClass("expanded");

    // Click again to collapse
    fireEvent.click(logSummary);
    expect(screen.queryByRole("region")).toBeNull(); // Details should be hidden again

    // Check if arrow rotates back
    expect(arrow).not.toHaveClass("expanded");
  });

  it("should correctly display the time and event message", () => {
    // Render the LogEntry component wrapped with local state for expansion
    render(<LogEntryWrapper log={mockLog} />);

    // Convert the mock timestamp to a readable format
    const logTime = new Date(mockLog._time).toISOString();

    // Verify the displayed time is correct
    expect(screen.getByText(logTime)).toBeInTheDocument();

    // Verify the message is displayed in the log summary
    expect(screen.getByText(/loading policy/i)).toBeInTheDocument();
  });

  it('should allow navigation using the "Tab" key and respond to "Enter" key for expanding/collapsing', () => {
    // Render the LogEntry component wrapped with local state for expansion
    render(<LogEntryWrapper log={mockLog} />);

    // Initially, details should be collapsed
    const logSummary = screen.getByTestId("log-entry");

    // Check if "Tab" can navigate to the log entry (focusable with tabIndex={0})
    logSummary.focus();
    expect(logSummary).toHaveFocus(); // Ensure the element has focus

    // Simulate pressing "Enter" to expand the log entry
    fireEvent.keyDown(logSummary, { key: "Enter", code: "Enter" });
    let detailSection = screen.queryByRole("region");
    expect(detailSection).toBeInTheDocument(); // Log details should appear after pressing Enter

    // Check if arrow rotated (i.e., has the expanded class)
    const arrow = screen.getByText("▶");
    expect(arrow).toHaveClass("expanded");

    // Simulate pressing "Enter" again to collapse the log entry
    fireEvent.keyDown(logSummary, { key: "Enter", code: "Enter" });
    detailSection = screen.queryByRole("region");
    expect(detailSection).toBeNull(); // Details should be hidden after pressing Enter again

    // Check if arrow rotates back
    expect(arrow).not.toHaveClass("expanded");
  });

  it('should also respond to "Space" key for expanding/collapsing', () => {
    // Render the LogEntry component wrapped with local state for expansion
    render(<LogEntryWrapper log={mockLog} />);

    // Initially, details should be collapsed
    const logSummary = screen.getByTestId("log-entry");

    // Simulate pressing "Space" to expand the log entry
    fireEvent.keyDown(logSummary, { key: " ", code: "Space" });
    let detailSection = screen.queryByRole("region");
    expect(detailSection).toBeInTheDocument(); // Log details should appear after pressing Space

    // Simulate pressing "Space" again to collapse the log entry
    fireEvent.keyDown(logSummary, { key: " ", code: "Space" });
    detailSection = screen.queryByRole("region");
    expect(detailSection).toBeNull(); // Details should be hidden after pressing Space again
  });
});
