import { useEffect, useState } from "react";

export const useListHeight = (): number => {
  const [listHeight, setListHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      setListHeight(window.innerHeight * 0.98);
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return listHeight;
};
