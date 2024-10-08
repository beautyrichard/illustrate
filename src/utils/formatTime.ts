export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};
