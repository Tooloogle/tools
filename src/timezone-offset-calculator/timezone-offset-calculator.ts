import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import timezoneOffsetCalculatorStyles from './timezone-offset-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('timezone-offset-calculator')
export class TimezoneOffsetCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, timezoneOffsetCalculatorStyles];

    @property()
    fromTimezone = 'UTC';

    @property()
    toTimezone = 'America/New_York';

    @property()
    selectedDateTime = '';

    private timezones = [
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Toronto',
        'America/Mexico_City',
        'America/Sao_Paulo',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Moscow',
        'Asia/Dubai',
        'Asia/Kolkata',
        'Asia/Shanghai',
        'Asia/Tokyo',
        'Asia/Seoul',
        'Asia/Singapore',
        'Australia/Sydney',
        'Pacific/Auckland',
    ];

    override connectedCallback() {
        super.connectedCallback();
        // Initialize with current time only on client-side
        if (!this.selectedDateTime) {
            const now = new Date();
            this.selectedDateTime = now.toISOString().slice(0, 16);
        }
    }

    private getTimeInTimezone(date: Date, timezone: string): string {
        return date.toLocaleString('en-US', { 
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    private getTimezoneOffset(timezone: string): string {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'longOffset'
        });
        
        const parts = formatter.formatToParts(date);
        const offsetPart = parts.find(part => part.type === 'timeZoneName');
        
        if (offsetPart && offsetPart.value.startsWith('GMT')) {
            const offset = offsetPart.value.replace('GMT', '');
            if (offset === '') return '+00:00';
            return offset;
        }
        
        // Fallback calculation
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        const offsetMs = tzDate.getTime() - utcDate.getTime();
        const offsetHours = offsetMs / (1000 * 60 * 60);
        const hours = Math.floor(Math.abs(offsetHours));
        const minutes = Math.round((Math.abs(offsetHours) - hours) * 60);
        const sign = offsetHours >= 0 ? '+' : '-';
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    private calculateDifference(): { hours: number; minutes: number } {
        const fromOffset = this.getTimezoneOffset(this.fromTimezone);
        const toOffset = this.getTimezoneOffset(this.toTimezone);
        
        const fromMinutes = this.offsetToMinutes(fromOffset);
        const toMinutes = this.offsetToMinutes(toOffset);
        const diffMinutes = toMinutes - fromMinutes;
        
        return {
            hours: Math.floor(Math.abs(diffMinutes) / 60),
            minutes: Math.abs(diffMinutes) % 60
        };
    }

    private offsetToMinutes(offset: string): number {
        const [hours, minutes] = offset.split(':').map(s => parseInt(s, 10));
        return hours * 60 + (hours < 0 ? -minutes : minutes);
    }

    private handleFromTimezoneChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.fromTimezone = target.value;
    }

    private handleToTimezoneChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.toTimezone = target.value;
    }

    private handleDateTimeChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.selectedDateTime = target.value;
    }

    override render() {
        const selectedDate = new Date(this.selectedDateTime);
        const fromTime = this.getTimeInTimezone(selectedDate, this.fromTimezone);
        const toTime = this.getTimeInTimezone(selectedDate, this.toTimezone);
        const fromOffset = this.getTimezoneOffset(this.fromTimezone);
        const toOffset = this.getTimezoneOffset(this.toTimezone);
        const diff = this.calculateDifference();

        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1">Select Date & Time</span>
                    <input
                        type="datetime-local"
                        class="form-input"
                        .value=${this.selectedDateTime}
                        @input=${this.handleDateTimeChange}
                    />
                </label>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1">From Timezone</span>
                        <select class="form-select" .value=${this.fromTimezone} @change=${this.handleFromTimezoneChange}>
                            ${this.timezones.map(tz => html`
                                <option value="${tz}">${tz.replace(/_/g, ' ')}</option>
                            `)}
                        </select>
                    </label>

                    <label class="block">
                        <span class="inline-block py-1">To Timezone</span>
                        <select class="form-select" .value=${this.toTimezone} @change=${this.handleToTimezoneChange}>
                            ${this.timezones.map(tz => html`
                                <option value="${tz}">${tz.replace(/_/g, ' ')}</option>
                            `)}
                        </select>
                    </label>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 rounded border border-blue-200">
                        <div class="text-sm font-semibold text-blue-900 mb-1">${this.fromTimezone.replace(/_/g, ' ')}</div>
                        <div class="text-2xl font-bold text-blue-700">${fromTime}</div>
                        <div class="text-sm text-blue-600 mt-1">UTC ${fromOffset}</div>
                    </div>

                    <div class="p-4 bg-green-50 rounded border border-green-200">
                        <div class="text-sm font-semibold text-green-900 mb-1">${this.toTimezone.replace(/_/g, ' ')}</div>
                        <div class="text-2xl font-bold text-green-700">${toTime}</div>
                        <div class="text-sm text-green-600 mt-1">UTC ${toOffset}</div>
                    </div>
                </div>

                <div class="p-4 bg-purple-50 rounded border border-purple-200 text-center">
                    <div class="font-semibold text-purple-900 mb-2">Time Difference</div>
                    <div class="text-3xl font-bold text-purple-700">
                        ${diff.hours} hours ${diff.minutes > 0 ? `${diff.minutes} minutes` : ''}
                    </div>
                </div>

                <div class="p-4 bg-gray-50 rounded border border-gray-200">
                    <div class="font-semibold text-gray-900 mb-2">Quick Reference</div>
                    <div class="text-sm text-gray-700 space-y-1">
                        <div>• UTC: Coordinated Universal Time (primary time standard)</div>
                        <div>• Positive offset (+): Ahead of UTC</div>
                        <div>• Negative offset (−): Behind UTC</div>
                        <div>• Daylight saving time affects offset in some regions</div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'timezone-offset-calculator': TimezoneOffsetCalculator;
    }
}
