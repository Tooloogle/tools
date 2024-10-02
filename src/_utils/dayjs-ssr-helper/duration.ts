import * as _duration from 'dayjs/plugin/duration.js';
import { isBrowser } from '../DomUtils.js';

declare let __webpack_require__: any;
let duration: typeof _duration.default;

if (isBrowser() && typeof __webpack_require__ !== 'function') {
    duration = (window as any).dayjs_plugin_duration;
} else {
    duration = _duration.default as any;
}

export default duration;
