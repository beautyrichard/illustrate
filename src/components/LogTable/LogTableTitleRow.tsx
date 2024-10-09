import React from "react";

const LogTableTitleRow: React.FC = () => {
  return (
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
  );
};

export default LogTableTitleRow;
