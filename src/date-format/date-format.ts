import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dateFormatStyles from './date-format.css.js';
import { repeat } from 'lit/directives/repeat.js';
import { hasClipboard, isBrowser } from '../_utils/DomUtils.js';
import "../t-copy-button/t-copy-button.js";
import { when } from 'lit/directives/when.js';
import inputStyles from '../_styles/input.css.js';
import dayjs from '../_utils/dayjs-ssr-helper/dayjs.js';

const localStorageKey = "t-date-format-custom";

function getCustomFormat() {
    if (isBrowser()) {
        return localStorage.getItem(localStorageKey);
    } else {
        return "YYYY-MM-DD";
    }
}

function setCustomFormat(format: string) {
    if (isBrowser()) {
        localStorage.setItem(localStorageKey, format ? format : "")
    }
}

@customElement('date-format')
export class DateFormat extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, dateFormatStyles];
    private dateFormats = [
        "MM/DD/YY",
        "MM/DD/YYYY",
        "M/D/YY",
        "DD/MM/YY",
        "DD/MM/YYYY",
        "D/M/YY",
        "YY/MM/DD",
        "YYYY/MM/DD",
        "YY/M/D",
        "MMM D, YYYY",
        "MMM DD, YYYY",
        "D MMM, YYYY",
        "DD MMM, YYYY",
        "YYYY, MMM D",
        "YYYY, MMM DD",
        "MMDDYY",
        "DDMMYY",
        "YYMMDD",
        "MMMDDYY",
        "DDMMMYY",
        "YYMMMDD"
    ];

    @property()
    withTime = false;

    @property()
    timeOnly = false;

    @property()
    value = dayjs().format("YYYY-MM-DD"); // YYYY-MM-DDThh:mm

    @property()
    customFormat = getCustomFormat();

    @property()
    result: { format: string, value: string }[] = this.getDateFormats(this.value);

    connectedCallback() {
        super.connectedCallback();

        this.result = this.getDateFormats(this.value);
    }

    onChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target?.value) {
            this.result = this.getDateFormats(target.value);
        }
    }

    onCustomFormatChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.customFormat = target?.value || "";
        setCustomFormat(target?.value || "");
    }
    getDateFormats(value: string) {
        return this.dateFormats.map(f => {
            return {
                format: f,
                value: dayjs(value).format(f)
            }
        });
    }

    async copyText(text: string) {
        if (!text) {
            return;
        }

        if (hasClipboard()) {
            await navigator.clipboard.writeText(text);
        }
    }

    override render() {
        return html`
            <div class="flex py-2">
                <input
                    name="email"
                    type="${this.withTime ? "datetime-local" : "date"}"
                    class="w-full form-input" 
                    autofocus
                    placeholder="Enter email to validate"
                    .value="${this.value}"
                    @change=${this.onChange}
                    />
            </div>
            <div class="grid grid-cols-2">
                <div class="text-end">
                    <input 
                        placeholder="Custom format"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                        .value=${this.customFormat}
                        @keyup=${this.onCustomFormatChange} />
                </div>
                <span class="p-2 flex content-center">
                    ${this.customFormat ? dayjs(this.value).format(this.customFormat) : ""}
                    ${when(this.customFormat, () => html`
                        <t-copy-button .text=${this.customFormat && dayjs(this.value).format(this.customFormat)}></t-copy-button>
                    `)}
                </span>
                ${repeat(this.result, item => html`
                    <span class="p-2 text-end">${item.format}</span>
                    <span class="p-2 flex content-center">
                        ${item.value}
                        <t-copy-button .text=${item.value}></t-copy-button>
                    </span>
                `)}
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'date-format': DateFormat;
    }
}
