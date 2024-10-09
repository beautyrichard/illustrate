import React, { useContext, useState, useRef, useEffect } from "react";
import { VariableSizeList as List } from "react-window";
import LogEntry from "../LogEntry/LogEntry";
import { LogContext, LogContextType } from "../../context/LogContext";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import "./LogTable.css";

const LogTable: React.FC = () => {
  const { logs } = useContext(LogContext) as LogContextType;
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const listRef = useRef<List>(null);
  const rowHeights = useRef<{ [index: number]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);

  // Use the custom useResizeObserver hook to get the container width
  const listWidth = useResizeObserver(containerRef);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const newExpandedRows = {
        ...prev,
        [index]: !prev[index]
      };

      if (listRef.current) {
        listRef.current.resetAfterIndex(index);
      }

      return newExpandedRows;
    });
  };

  const getItemSize = (index: number) => {
    return rowHeights.current[index] || 32;
  };

  const setRowHeight = (index: number, size: number) => {
    if (size === 0) return;
    if (rowHeights.current[index] !== size) {
      rowHeights.current[index] = size;
      if (listRef.current) {
        listRef.current.resetAfterIndex(index);
      }
    }
  };

  // Set the height based on 100vh
  useEffect(() => {
    const updateHeight = () => {
      setListHeight(window.innerHeight * 0.98); // or use window.innerHeight directly for 100vh equivalent
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const Row = ({
    index,
    style
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const log = logs[index];
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
    }, []);

    const isEven = index % 2 === 0;

    return (
      <div style={style}>
        <div ref={rowRef}>
          <LogEntry
            key={index}
            log={log}
            isExpanded={!!expandedRows[index]}
            onToggle={() => toggleRow(index)}
            isEven={isEven}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="log-table-container" ref={containerRef}>
      <div className="log-table" role="table" aria-label="Log Entries Table">
        <div role="rowgroup">
          <div className="title-row" role="row">
            <div role="columnheader" aria-sort="none">
              Time
            </div>
            <div role="columnheader" aria-sort="none">
              Event
            </div>
          </div>
        </div>

        <div role="rowgroup">
          <List
            ref={listRef}
            height={listHeight} // Use the dynamic listHeight based on 100vh
            itemCount={logs.length}
            itemSize={getItemSize} // Function to calculate the size dynamically
            width={listWidth} // Use the width returned by useResizeObserver
          >
            {Row}
          </List>
        </div>
      </div>
    </div>
  );
};

export default LogTable;
