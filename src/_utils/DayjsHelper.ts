import * as _dayjs from 'dayjs';
import * as _duration from 'dayjs/plugin/duration.js';
import { isBrowser } from './DomUtils.js';

let dayjs: typeof _dayjs.default;
let dayjs_plugin_duration: typeof _duration.default;

if (!isBrowser()) {
    dayjs = _dayjs.default as any;
    dayjs_plugin_duration = _duration.default as any;
} else {
    dayjs = (window as any).dayjs;
    dayjs_plugin_duration = (window as any).dayjs_plugin_duration;
}

export const duration = dayjs_plugin_duration;
export default dayjs;
