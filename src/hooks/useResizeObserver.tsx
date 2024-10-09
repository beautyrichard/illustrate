import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

// Custom hook to observe container width
export const useResizeObserver = (
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const currentContainer = containerRef.current; // Capture the ref value in a local variable

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        // Use the captured ref value here
        observer.unobserve(currentContainer);
      }
    };
  }, [containerRef]);

  return width;
};
