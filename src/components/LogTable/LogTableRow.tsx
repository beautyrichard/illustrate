import React, { useEffect, useRef } from "react";
import LogEntry from "../LogEntry/LogEntry";

interface LogTableRowProps {
  index: number;
  log: any; // You can replace 'any' with the actual type of the log entry
  style: React.CSSProperties;
  isExpanded: boolean;
  onToggle: () => void;
  setRowHeight: (index: number, height: number) => void;
}

const LogTableRow: React.FC<LogTableRowProps> = ({
  index,
  log,
  style,
  isExpanded,
  onToggle,
  setRowHeight
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setRowHeight(index, entry.contentRect.height);
      }
    });

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => {
      if (rowRef.current) {
        observer.unobserve(rowRef.current);
      }
    };
  }, [index, setRowHeight]);

  const isEven = index % 2 === 0;

  return (
    <div style={style}>
      <div ref={rowRef}>
        <LogEntry
          key={index}
          log={log}
          isExpanded={isExpanded}
          onToggle={onToggle}
          isEven={isEven}
        />
      </div>
    </div>
  );
};

export default LogTableRow;
