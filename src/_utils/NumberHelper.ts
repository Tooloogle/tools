import { getCurrentLocale } from "./LocaleHelper.js";

export function formatNumber(num: number, fraction = 2) {
    if (num === undefined || isNaN(num)) {
        return num;
    }

    try {
        num = Number(num);
    } catch (err) {
        return num;
    }

    return num.toLocaleString(getCurrentLocale(), {
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction,
    });
}
