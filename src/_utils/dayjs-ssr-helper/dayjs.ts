import * as _dayjs from 'dayjs';
import { isBrowser } from '../DomUtils.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let __webpack_require__: NodeRequire | undefined;

declare global {
  interface Window {
    dayjs: typeof _dayjs.default;
  }
}

let dayjs: typeof _dayjs.default;

if (isBrowser() && typeof __webpack_require__ !== 'function') {
  dayjs = window.dayjs;
} else {
  dayjs = _dayjs.default;
}

export default dayjs;