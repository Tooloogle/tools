import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import worldClockStyles from './world-clock.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('world-clock')
export class WorldClock extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, worldClockStyles];

    @property({ type: String }) currentTime = '';
    private intervalId: number | null = null;

    private timezones = [
        { name: 'New York', tz: 'America/New_York' },
        { name: 'London', tz: 'Europe/London' },
        { name: 'Paris', tz: 'Europe/Paris' },
        { name: 'Tokyo', tz: 'Asia/Tokyo' },
        { name: 'Sydney', tz: 'Australia/Sydney' },
        { name: 'Dubai', tz: 'Asia/Dubai' },
        { name: 'Los Angeles', tz: 'America/Los_Angeles' },
        { name: 'Singapore', tz: 'Asia/Singapore' },
        { name: 'Mumbai', tz: 'Asia/Kolkata' },
        { name: 'Hong Kong', tz: 'Asia/Hong_Kong' }
    ];

    override connectedCallback() {
        super.connectedCallback();
        if (isBrowser()) {
            this.updateTime();
            this.intervalId = window.setInterval(() => this.updateTime(), 1000) as unknown as number;
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.intervalId !== null && isBrowser()) {
            clearInterval(this.intervalId);
        }
    }

    private updateTime() {
        this.currentTime = new Date().toISOString();
        this.requestUpdate();
    }

    private getTimeInTimezone(tz: string): string {
        if (!isBrowser()) return '';
        try {
            return new Date().toLocaleString('en-US', {
                timeZone: tz,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return 'N/A';
        }
    }

    private getDateInTimezone(tz: string): string {
        if (!isBrowser()) return '';
        try {
            return new Date().toLocaleString('en-US', {
                timeZone: tz,
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'N/A';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <h3 class="text-xl font-semibold">World Clock</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${this.timezones.map(({ name, tz }) => html`
                        <div class="p-4 border rounded-lg bg-gray-50">
                            <div class="font-semibold text-lg">${name}</div>
                            <div class="text-3xl font-mono font-bold my-2">${this.getTimeInTimezone(tz)}</div>
                            <div class="text-sm text-gray-600">${this.getDateInTimezone(tz)}</div>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'world-clock': WorldClock;
    }
}
