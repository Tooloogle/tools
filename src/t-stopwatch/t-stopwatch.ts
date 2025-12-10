import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tStopwatchStyles from './t-stopwatch.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('t-stopwatch')
export class TStopwatch extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, tStopwatchStyles];

    @property({ type: Number }) elapsedTime = 0;
    @property({ type: Boolean }) isRunning = false;
    @property({ type: Array }) laps: number[] = [];
    private intervalId: number | null = null;
    private startTime = 0;
    private pausedTime = 0;

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.intervalId !== null && isBrowser()) {
            clearInterval(this.intervalId);
        }
    }

    private formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    private start() {
        if (!this.isRunning && isBrowser()) {
            this.isRunning = true;
            this.startTime = Date.now() - this.pausedTime;
            this.intervalId = window.setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
            }, 10) as unknown as number;
        }
    }

    private stop() {
        if (this.isRunning && isBrowser()) {
            this.isRunning = false;
            this.pausedTime = this.elapsedTime;
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }

    private reset() {
        this.stop();
        this.elapsedTime = 0;
        this.pausedTime = 0;
        this.laps = [];
    }

    private lap() {
        if (this.isRunning) {
            this.laps = [...this.laps, this.elapsedTime];
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-6xl font-mono font-bold mb-4">${this.formatTime(this.elapsedTime)}</div>
                    <div class="space-x-2">
                        ${!this.isRunning ? html`
                            <button @click=${this.start} class="btn-primary">Start</button>
                        ` : html`
                            <button @click=${this.stop} class="btn-secondary">Stop</button>
                            <button @click=${this.lap} class="btn-secondary">Lap</button>
                        `}
                        <button @click=${this.reset} class="btn-secondary">Reset</button>
                    </div>
                </div>
                ${this.laps.length > 0 ? html`
                    <div>
                        <h3 class="font-semibold mb-2">Lap Times:</h3>
                        <div class="space-y-1">
                            ${this.laps.map((lap, i) => html`
                                <div class="flex justify-between p-2 bg-gray-50 rounded">
                                    <span>Lap ${i + 1}</span>
                                    <span class="font-mono">${this.formatTime(lap)}</span>
                                </div>
                            `)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-stopwatch': TStopwatch;
    }
}
