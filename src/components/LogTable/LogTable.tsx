import React, { useContext, useState, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import LogTableRow from "./LogTableRow";
import LogTableTitleRow from "./LogTableTitleRow";
import { LogContext, LogContextType } from "../../context/LogContext";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { useListHeight } from "../../hooks/useListHeight"; // Custom hook to calculate height
import "./LogTable.css";

const LogTable: React.FC = () => {
  const { logs } = useContext(LogContext) as LogContextType;
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const listRef = useRef<List>(null);
  const rowHeights = useRef<{ [index: number]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const listHeight = useListHeight(); // Use the custom hook to get list height
  const listWidth = useResizeObserver(containerRef); // Use the custom hook for width

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

  return (
    <div className="log-table-container" ref={containerRef}>
      <div className="log-table" role="table" aria-label="Log Entries Table">
        <LogTableTitleRow /> {/* Title Row extracted as its own component */}
        <div role="rowgroup">
          <List
            ref={listRef}
            height={listHeight} // Use the dynamic listHeight based on 100vh
            itemCount={logs.length}
            itemSize={getItemSize} // Function to calculate the size dynamically
            width={listWidth} // Use the width returned by useResizeObserver
          >
            {({ index, style }) => (
              <LogTableRow
                index={index}
                log={logs[index]}
                style={style}
                isExpanded={!!expandedRows[index]}
                onToggle={() => toggleRow(index)}
                setRowHeight={setRowHeight}
              />
            )}
          </List>
        </div>
      </div>
    </div>
  );
};

export default LogTable;
