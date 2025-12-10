import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import unixTimestampConverterStyles from './unix-timestamp-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import dayjs from 'dayjs';
import '../t-button';
import '../t-input';

@customElement('unix-timestamp-converter')
export class UnixTimestampConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, unixTimestampConverterStyles];

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

    private handleTimestampChange(e: CustomEvent) {
        this.timestamp = Number(e.detail.value);
        this.updateFromTimestamp();
    }

    private handleDatetimeChange(e: CustomEvent) {
        this.datetime = e.detail.value;
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
                    <t-input type="number" class="text-end"></t-input>
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Date & Time</span>
                    <t-input type="datetime-local" .value=${String(this.datetime)} @t-input=${this.handleDatetimeChange}></t-input>
                </label>

                <div class="block">
                    <span class="inline-block py-1 font-bold">Human Readable</span>
                    <div class="p-3 bg-gray-100 rounded text-lg">
                        ${this.humanReadable}
                    </div>
                </div>

                <div class="text-right">
                    <t-button variant="blue" @click=${this.setCurrentTime}>Current Time</t-button>
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
