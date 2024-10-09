// utils/dateUtils.test.ts
import { formatTime, formatDate, getDayStart } from "./dateUtils";

describe("dateUtils", () => {
  describe("formatTime", () => {
    it("formats time correctly with hours and minutes", () => {
      expect(formatTime(14, 5)).toBe("14:05");
      expect(formatTime(0, 0)).toBe("00:00");
      expect(formatTime(23, 59)).toBe("23:59");
    });

    it("formats time correctly with hours only (defaults minutes to 00)", () => {
      expect(formatTime(9)).toBe("09:00");
      expect(formatTime(15)).toBe("15:00");
    });
  });

  describe("formatDate", () => {
    it("formats timestamp into YYYY-MM-DD correctly", () => {
      // Jan 1, 2023 (UTC)
      const timestamp = Date.parse("2023-01-01T00:00:00Z"); // Use UTC format
      expect(formatDate(timestamp)).toBe("2022-12-31");

      // Dec 31, 2023 (UTC)
      const timestamp2 = Date.parse("2023-12-31T23:59:59Z"); // Use UTC format
      expect(formatDate(timestamp2)).toBe("2023-12-31");
    });

    it("handles leap years correctly", () => {
      // Feb 29, 2024 (UTC)
      const leapYearTimestamp = Date.parse("2024-02-29T12:00:00Z"); // Use UTC format
      expect(formatDate(leapYearTimestamp)).toBe("2024-02-29");
    });
  });
});
