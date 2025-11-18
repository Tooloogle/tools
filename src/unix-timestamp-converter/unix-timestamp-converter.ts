import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import unixTimestampConverterStyles from './unix-timestamp-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import dayjs from 'dayjs';

@customElement('unix-timestamp-converter')
export class UnixTimestampConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, unixTimestampConverterStyles];

    @property()
    timestamp = Math.floor(Date.now() / 1000);

    @property()
    datetime = '';

    @property()
    humanReadable = '';

    connectedCallback() {
        super.connectedCallback();
        this.updateFromTimestamp();
    }

    private handleTimestampChange(e: Event) {
        this.timestamp = Number((e.target as HTMLInputElement).value);
        this.updateFromTimestamp();
    }

    private handleDatetimeChange(e: Event) {
        this.datetime = (e.target as HTMLInputElement).value;
        this.updateFromDatetime();
    }

    private updateFromTimestamp() {
        const date = new Date(this.timestamp * 1000);
        this.datetime = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
        this.humanReadable = dayjs(date).format('MMMM D, YYYY h:mm:ss A');
    }

    private updateFromDatetime() {
        if (this.datetime) {
            const date = new Date(this.datetime);
            this.timestamp = Math.floor(date.getTime() / 1000);
            this.humanReadable = dayjs(date).format('MMMM D, YYYY h:mm:ss A');
        }
    }

    private setCurrentTime() {
        this.timestamp = Math.floor(Date.now() / 1000);
        this.updateFromTimestamp();
    }

    override render() {
        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Unix Timestamp (seconds)</span>
                    <input
                        class="form-input text-end"
                        type="number"
                        .value=${String(this.timestamp)}
                        @input=${this.handleTimestampChange}
                    />
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Date & Time</span>
                    <input
                        class="form-input"
                        type="datetime-local"
                        .value=${this.datetime}
                        @input=${this.handleDatetimeChange}
                    />
                </label>

                <div class="block">
                    <span class="inline-block py-1 font-bold">Human Readable</span>
                    <div class="p-3 bg-gray-100 rounded text-lg">
                        ${this.humanReadable}
                    </div>
                </div>

                <div class="text-right">
                    <button class="btn btn-blue" @click=${this.setCurrentTime}>Current Time</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'unix-timestamp-converter': UnixTimestampConverter;
    }
}
