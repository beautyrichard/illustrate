// LogTableTitleRow.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import LogTableTitleRow from "./LogTableTitleRow";

describe("LogTableTitleRow", () => {
  it("renders the Time and Event column headers", () => {
    render(<LogTableTitleRow />);

    // Check that Time and Event headers are rendered
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  it("applies the correct roles to the headers", () => {
    render(<LogTableTitleRow />);

    // Check that both headers have role="columnheader"
    const timeHeader = screen.getByText("Time");
    const eventHeader = screen.getByText("Event");

    expect(timeHeader).toHaveAttribute("role", "columnheader");
    expect(eventHeader).toHaveAttribute("role", "columnheader");
  });

  it("applies the aria-sort attribute with 'none'", () => {
    render(<LogTableTitleRow />);

    // Check that both headers have aria-sort="none"
    const timeHeader = screen.getByText("Time");
    const eventHeader = screen.getByText("Event");

    expect(timeHeader).toHaveAttribute("aria-sort", "none");
    expect(eventHeader).toHaveAttribute("aria-sort", "none");
  });
});
