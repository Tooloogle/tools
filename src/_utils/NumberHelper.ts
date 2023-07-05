export function formatNumber(num: number, fraction = 2) {
    if (num === undefined) {
        return num;
    }

    // return new Intl.NumberFormat('en-IN', {
    //     maximumFractionDigits: 2,
    // }).format(num);
    return `${num.toFixed(fraction)}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
}
