import * as _duration from 'dayjs/plugin/duration.js';
import { isBrowser } from '../DomUtils.js';

let duration: typeof _duration.default;

if (isBrowser()) {
    duration = (window as any).dayjs_plugin_duration;
} else {
    duration = _duration.default as any;
}

export default duration;
