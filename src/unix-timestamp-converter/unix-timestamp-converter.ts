import { html, type PropertyValues } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import unixTimestampConverterStyles from './unix-timestamp-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import { dateTimeInput, parseDateTime, parseEpoch } from './epoch.js';
import '../t-copy-button/index.js';

@customElement('unix-timestamp-converter')
export class UnixTimestampConverter extends WebComponentBase {
    static override styles = [WebComponentBase.styles, unixTimestampConverterStyles];

    @property({ type: Number })
    timestamp = Math.floor(Date.now() / 1000);

    @property() datetime = '';
    @property() humanReadable = '';
    @property() epochInput = '';
    @property() unit = 'seconds';
    @property() zone = 'local';
    @property() secondsOutput = '';
    @property() millisecondsOutput = '';
    @property() isoOutput = '';
    @property() error = '';
    private instant?: number;

    override connectedCallback() {
        super.connectedCallback();
        if (!this.hasUpdated) {
            this.updateFromTimestamp();
        }
    }

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('timestamp') && this.timestamp !== Math.floor((this.instant ?? NaN) / 1000)) {
            this.updateFromTimestamp();
        }

        if ((changed.has('unit') || changed.has('zone')) && this.instant !== undefined) {
            this.applyInstant(this.instant);
        }
    }

    private applyInstant(milliseconds: number) {
        const date = new Date(milliseconds);
        this.instant = milliseconds;
        this.timestamp = Math.floor(milliseconds / 1000);
        this.secondsOutput = String(this.timestamp);
        this.millisecondsOutput = String(milliseconds);
        this.epochInput = this.unit === 'milliseconds' ? this.millisecondsOutput : this.secondsOutput;
        this.datetime = dateTimeInput(milliseconds, this.zone);
        this.isoOutput = date.toISOString();
        const timezone = this.zone === 'utc' ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.humanReadable = `${date.toLocaleString(undefined, { timeZone: timezone })} (${timezone})`;
        this.error = '';
    }

    private clearOutputs() {
        this.instant = undefined;
        this.datetime = '';
        this.humanReadable = '';
        this.secondsOutput = '';
        this.millisecondsOutput = '';
        this.isoOutput = '';
    }

    private handleTimestampChange(e: Event) {
        this.epochInput = (e.target as HTMLInputElement).value;
        try {
            this.applyInstant(parseEpoch(this.epochInput, this.unit));
        } catch (error) {
            this.clearOutputs();
            this.error = (error as Error).message;
        }
    }

    private handleDatetimeChange(e: Event) {
        this.datetime = (e.target as HTMLInputElement).value;
        try {
            this.applyInstant(parseDateTime(this.datetime, this.zone));
        } catch (error) {
            this.epochInput = '';
            this.clearOutputs();
            this.error = (error as Error).message;
        }
    }

    private updateFromTimestamp() {
        try {
            this.applyInstant(parseEpoch(String(this.timestamp), 'seconds'));
        } catch (error) {
            this.clearOutputs();
            this.error = (error as Error).message;
        }
    }

    private changeOption(event: Event) {
        const select = event.target as HTMLSelectElement;
        if (select.name === 'unit') {
            this.unit = select.value;
        } else {
            this.zone = select.value;
        }
    }

    private setCurrentTime() {
        this.applyInstant(Date.now());
    }

    private reset() {
        this.clearOutputs();
        this.epochInput = '';
        this.error = '';
        this.unit = 'seconds';
        this.zone = 'local';
    }

    private renderResult(label: string, value: string) {
        return html`
            <div>
                <div class="flex items-center justify-between gap-2 py-1">
                    <span class="font-bold">${label}</span>
                    <t-copy-button .text=${value} .disabled=${!value} .title=${`Copy ${label}`}></t-copy-button>
                </div>
                <textarea aria-label=${label} class="form-textarea font-mono text-sm" rows="2" readonly .value=${value}></textarea>
            </div>`;
    }

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <div class="epoch-controls">
                    <label class="block">Timestamp unit
                        <select name="unit" class="form-select" .value=${this.unit} @change=${this.changeOption}>
                            <option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option>
                        </select>
                    </label>
                    <label class="block">Date timezone
                        <select name="zone" class="form-select" .value=${this.zone} @change=${this.changeOption}>
                            <option value="local">Local</option><option value="utc">UTC</option>
                        </select>
                    </label>
                </div>
                <label class="block">Unix timestamp (${this.unit})
                    <input name="epoch" class="form-input font-mono" type="text" inputmode="text"
                        .value=${this.epochInput} @input=${this.handleTimestampChange} />
                </label>
                <label class="block">Date &amp; time (${this.zone === 'utc' ? 'UTC' : 'Local'})
                    <input name="datetime" class="form-input" type="datetime-local" step="0.001"
                        .value=${this.datetime} @input=${this.handleDatetimeChange} />
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                ${this.renderResult('Epoch seconds', this.secondsOutput)}
                ${this.renderResult('Epoch milliseconds', this.millisecondsOutput)}
                ${this.renderResult('ISO 8601 (UTC)', this.isoOutput)}
                ${this.renderResult('Human readable', this.humanReadable)}
                <div class="flex flex-wrap justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
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
