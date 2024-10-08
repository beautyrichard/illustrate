import React, { useContext, useState, useRef, useEffect } from "react";
import { LogContext } from "../../context/LogContext";
import { LogType } from "../../hooks/useFetchLogs";
import Tooltip from "../Tooltip/Tooltip";
import "./Timeline.css";

interface LogContextType {
  logs: LogType[];
}

interface TimelineProps {
  color?: string;
}

const formatTime = (hours: number, minutes: number = 0): string => {
  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}`;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDayStart = (timestamp: number): number => {
  const date = new Date(timestamp);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
};

const Timeline: React.FC<TimelineProps> = ({ color = "#8884d8" }) => {
  const { logs } = useContext(LogContext) as LogContextType;
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logs.length > 0) {
      setCurrentDay(getDayStart(logs[0]._time));
    }
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    const logTime = log._time;
    if (currentDay !== null) {
      return logTime >= currentDay && logTime < currentDay + 86400000;
    }
    return false;
  });

  const timeBuckets: Record<string, number> = {};
  for (let hour = 0; hour < 24; hour++) {
    timeBuckets[hour] = 0;
  }

  filteredLogs.forEach((log) => {
    const date = new Date(log._time);
    const hour = date.getHours();
    timeBuckets[hour] += 1;
  });

  const data = Object.entries(timeBuckets).map(([hour, count]) => ({
    time: Number(hour),
    count
  }));

  const maxCount = Math.max(...data.map((d) => d.count));

  const handlePreviousDay = () => {
    if (logs.some((log) => log._time < currentDay!)) {
      setCurrentDay((prevDay) =>
        prevDay !== null ? prevDay - 86400000 : null
      );
    }
  };

  const handleNextDay = () => {
    if (logs.some((log) => log._time >= currentDay! + 86400000)) {
      setCurrentDay((prevDay) =>
        prevDay !== null ? prevDay + 86400000 : null
      );
    }
  };

  const firstLogTime = logs.length > 0 ? formatDate(logs[0]._time) : "";
  const lastLogTime =
    logs.length > 0 ? formatDate(logs[logs.length - 1]._time) : "";

  const isPrevDayAvailable = logs.some((log) => log._time < currentDay!);
  const isNextDayAvailable = logs.some(
    (log) => log._time >= currentDay! + 86400000
  );

  const yAxisValues = [];
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    yAxisValues.push(Math.round((i / numTicks) * maxCount));
  }

  const chartContainerWidth = chartContainerRef.current?.offsetWidth;

  return (
    <figure>
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

      <div className="time-period">
        <strong>Time Period:</strong> {firstLogTime} to {lastLogTime}
      </div>

      <div className="chart-container" ref={chartContainerRef}>
        <div className="y-axis">
          {yAxisValues.reverse().map((value, index) => (
            <div key={index} className="y-tick">
              {value}
              <div
                className="y-gridline"
                style={{ width: `${chartContainerWidth}px` }}
              />
            </div>
          ))}
        </div>

        <div className="bar-chart">
          {data.map((d, index) => (
            <div
              key={index}
              data-testid={`bar-${index}`}
              className="bar"
              style={{
                minWidth: "16px",
                height: `${(d.count / maxCount) * 100}%`,
                backgroundColor: color
              }}
              tabIndex={0} // Make the bars keyboard focusable
              role="button" // Treat the bars as buttons for screen readers
              aria-label={`Hour: ${formatTime(d.time)}, Count: ${d.count}`}
              onMouseEnter={(e) => {
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  content: `Hour: ${formatTime(d.time)}\nCount: ${d.count}`
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const rect = (
                    e.target as HTMLDivElement
                  ).getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                    content: `Hour: ${formatTime(d.time)}\nCount: ${d.count}`
                  });
                }
              }}
            >
              <span className="bar-label">{formatTime(d.time)}</span>
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} />
      )}

      <div className="x-axis-line"></div>
    </figure>
  );
};

export default Timeline;
