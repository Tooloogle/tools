import * as _dayjs from 'dayjs';
import { isBrowser } from '../DomUtils.js';

let dayjs: typeof _dayjs.default;

if (isBrowser()) {
    dayjs = (window as any).dayjs;
} else {
    dayjs = _dayjs.default as any;
}

export default dayjs;
