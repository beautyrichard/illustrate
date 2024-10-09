// TimelineControls.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // For custom matchers like toBeDisabled
import TimelineControls from "./TimelineControls";
import * as dateUtils from "../../utils/dateUtils"; // Import the dateUtils to mock formatDate

describe("TimelineControls Component", () => {
  const mockHandlePreviousDay = jest.fn();
  const mockHandleNextDay = jest.fn();

  const props = {
    currentDay: 1633036800000, // A mock timestamp for the current day (October 1, 2021)
    isPrevDayAvailable: true,
    isNextDayAvailable: true,
    formatDate: dateUtils.formatDate, // Reference the actual formatDate function
    handlePreviousDay: mockHandlePreviousDay,
    handleNextDay: mockHandleNextDay
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("renders Previous Day and Next Day buttons", () => {
    render(<TimelineControls {...props} />);

    const prevButton = screen.getByRole("button", { name: /previous day/i });
    const nextButton = screen.getByRole("button", { name: /next day/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("disables the Previous Day button if isPrevDayAvailable is false", () => {
    render(<TimelineControls {...props} isPrevDayAvailable={false} />);

    const prevButton = screen.getByRole("button", { name: /previous day/i });
    expect(prevButton).toBeDisabled(); // Button should be disabled
  });

  it("disables the Next Day button if isNextDayAvailable is false", () => {
    render(<TimelineControls {...props} isNextDayAvailable={false} />);

    const nextButton = screen.getByRole("button", { name: /next day/i });
    expect(nextButton).toBeDisabled(); // Button should be disabled
  });

  it("calls handlePreviousDay when the Previous Day button is clicked and enabled", () => {
    render(<TimelineControls {...props} />);

    const prevButton = screen.getByRole("button", { name: /previous day/i });
    fireEvent.click(prevButton);

    expect(mockHandlePreviousDay).toHaveBeenCalledTimes(1); // Ensure event handler is called
  });

  it("calls handleNextDay when the Next Day button is clicked and enabled", () => {
    render(<TimelineControls {...props} />);

    const nextButton = screen.getByRole("button", { name: /next day/i });
    fireEvent.click(nextButton);

    expect(mockHandleNextDay).toHaveBeenCalledTimes(1); // Ensure event handler is called
  });

  it("does not call handlePreviousDay if Previous Day button is disabled", () => {
    render(<TimelineControls {...props} isPrevDayAvailable={false} />);

    const prevButton = screen.getByRole("button", { name: /previous day/i });
    fireEvent.click(prevButton);

    expect(mockHandlePreviousDay).not.toHaveBeenCalled(); // Ensure handler is not called
  });

  it("does not call handleNextDay if Next Day button is disabled", () => {
    render(<TimelineControls {...props} isNextDayAvailable={false} />);

    const nextButton = screen.getByRole("button", { name: /next day/i });
    fireEvent.click(nextButton);

    expect(mockHandleNextDay).not.toHaveBeenCalled(); // Ensure handler is not called
  });

  it("displays the current day when currentDay is provided", () => {
    // Mock formatDate to return a consistent date
    jest.spyOn(dateUtils, "formatDate").mockReturnValue("2021-09-30");

    render(<TimelineControls {...props} />);

    expect(screen.getByText("2021-09-30")).toBeInTheDocument();
  });
});
