import React from "react";
import { formatTime } from "../../utils/dateUtils";

interface TimeBucket {
  time: number;
  count: number;
}

interface TimelineChartProps {
  timeBuckets: TimeBucket[];
  maxCount: number;
  yAxisValues: number[];
  color: string;
  setTooltip: (
    tooltip: { x: number; y: number; content: string } | null
  ) => void;
  chartContainerWidth: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  timeBuckets,
  maxCount,
  yAxisValues,
  color,
  setTooltip,
  chartContainerWidth
}) => {
  return (
    <div className="chart-container">
      <div className="y-axis">
        {yAxisValues.map((value, index) => (
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
        {timeBuckets.map((d, index) => (
          <div
            key={index}
            data-testid={`bar-${index}`}
            className="bar"
            style={{
              minWidth: "16px",
              height: `${(d.count / maxCount) * 100}%`,
              backgroundColor: color
            }}
            tabIndex={0}
            role="button"
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
  );
};

export default TimelineChart;
