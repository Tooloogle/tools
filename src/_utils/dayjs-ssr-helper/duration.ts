import * as _duration from 'dayjs/plugin/duration.js';
import { isBrowser } from '../DomUtils.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let __webpack_require__: NodeRequire | undefined;
declare global {
  interface Window {
    dayjs_plugin_duration: typeof _duration.default;
  }
}

let duration: typeof _duration.default;

if (isBrowser() && typeof __webpack_require__ !== 'function') {
    duration = window.dayjs_plugin_duration;
} else {
    duration = _duration.default;
}

export default duration;
