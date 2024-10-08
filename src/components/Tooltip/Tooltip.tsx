interface TooltipProps {
  x: number;
  y: number;
  content: string;
}

// Tooltip component
const Tooltip: React.FC<TooltipProps> = ({ x, y, content }) => {
  return (
    <div
      className="tooltip"
      style={{ left: x, top: y }}
      role="tooltip"
      aria-live="polite"
    >
      {content}
    </div>
  );
};

export default Tooltip;
