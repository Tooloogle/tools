import { formatNumber } from "./NumberHelper.js";

describe("NumberHelper tests", () => {
    it("should formatNumber", () => {
        expect(formatNumber(123)).toBe("123.00");
        expect(formatNumber(123, 0)).toBe("123");
        expect(formatNumber(12356.423000009, 5)).toBe("12,356.42300");
    });
});
