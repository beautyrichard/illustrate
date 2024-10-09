import React from "react";

interface TimelineControlsProps {
  currentDay: number | null;
  isPrevDayAvailable: boolean;
  isNextDayAvailable: boolean;
  formatDate: (timestamp: number) => string;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentDay,
  isPrevDayAvailable,
  isNextDayAvailable,
  formatDate,
  handlePreviousDay,
  handleNextDay
}) => {
  return (
    <div className="controls">
      <button
        onClick={handlePreviousDay}
        disabled={!isPrevDayAvailable}
        aria-label="Previous Day"
      >
        Previous Day
      </button>
      <button
        onClick={handleNextDay}
        disabled={!isNextDayAvailable}
        aria-label="Next Day"
      >
        Next Day
      </button>
      {currentDay && (
        <div className="current-day" aria-live="polite">
          <strong>Current Day:</strong> {formatDate(currentDay)}
        </div>
      )}
    </div>
  );
};

export default TimelineControls;
