import * as _dayjs from 'dayjs';
import { isBrowser } from '../DomUtils.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let __webpack_require__: any;
let dayjs: typeof _dayjs.default;

if (isBrowser() && typeof __webpack_require__ !== 'function') {
    dayjs = (window as any).dayjs;
} else {
    dayjs = _dayjs.default as any;
}

export default dayjs;
