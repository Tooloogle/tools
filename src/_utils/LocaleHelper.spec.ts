import { getCurrentLang, getCurrentLocale, getCurrentLocaleCountry } from "./LocaleHelper.js";

describe("LocaleHelper tests", () => {
    it("should return correct locale country and language", () => {
        const defaultLocale = getCurrentLocale("en-US");
        expect(defaultLocale).toBe("en-US");
        expect(getCurrentLocaleCountry(defaultLocale)).toBe("US");
        expect(getCurrentLang(defaultLocale)).toBe("en");
    });
});
