import { getByTestId, render, screen } from "@testing-library/react";
import { LogContext } from "../../context/LogContext";
import Timeline from "./Timeline";

// Use corrected mockLogs data
const mockLogs = [
  {
    _time: 1724323612592, // Sample timestamp in milliseconds
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
  },
  {
    _time: 1724323576596, // Another timestamp
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
    error: {
      message: "Unknown product search",
      stack: `Error at new CriblError ...`
    }
  },
  {
    _time: 1724323504596,
    cid: "api",
    channel: "gitmgr",
    level: "info",
    message: "initializing git mgr"
  }
];

describe("Timeline Component", () => {
  // Test the 'color' prop
  test("renders bars with the correct color", () => {
    render(
      <LogContext.Provider value={{ logs: mockLogs, error: null }}>
        <Timeline color="red" /> {/* Test with red color */}
      </LogContext.Provider>
    );

    expect(screen.getByTestId("bar-0")).toHaveStyle("background-color: red");
  });

  // Test the X-Axis labels (00:00 to 23:00)
  test("renders correct X-Axis labels from 00:00 to 23:00", () => {
    render(
      <LogContext.Provider value={{ logs: mockLogs, error: null }}>
        <Timeline />
      </LogContext.Provider>
    );

    // X-axis should contain 24 labels, from 00:00 to 23:00
    const expectedLabels = [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00"
    ];

    // Get all elements displaying X-Axis labels (match by text format)
    expectedLabels.forEach((label) => {
      const labelElement = screen.getByText(label);
      expect(labelElement).toBeInTheDocument();
    });
  });
});
