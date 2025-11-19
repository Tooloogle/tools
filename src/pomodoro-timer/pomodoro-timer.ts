import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import pomodoroTimerStyles from './pomodoro-timer.css.js';
import { customElement, property } from 'lit/decorators.js';
import buttonStyles from '../_styles/button.css.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('pomodoro-timer')
export class PomodoroTimer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, buttonStyles, pomodoroTimerStyles];

    @property({ type: Number }) timeLeft = 25 * 60;
    @property({ type: Boolean }) isRunning = false;
    @property({ type: String }) phase = 'work'; // 'work' or 'break'
    @property({ type: Number }) completedPomodoros = 0;
    private intervalId: number | null = null;

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.intervalId !== null && isBrowser()) {
            clearInterval(this.intervalId);
        }
    }

    private formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    private start() {
        if (!this.isRunning && isBrowser()) {
            this.isRunning = true;
            this.intervalId = window.setInterval(() => {
                this.timeLeft--;
                if (this.timeLeft <= 0) {
                    this.complete();
                }
            }, 1000) as unknown as number;
        }
    }

    private pause() {
        if (this.isRunning && isBrowser()) {
            this.isRunning = false;
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }

    private reset() {
        this.pause();
        this.timeLeft = this.phase === 'work' ? 25 * 60 : 5 * 60;
    }

    private complete() {
        this.pause();
        if (this.phase === 'work') {
            this.completedPomodoros++;
            this.phase = 'break';
            this.timeLeft = 5 * 60;
        } else {
            this.phase = 'work';
            this.timeLeft = 25 * 60;
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-2xl font-semibold mb-2 ${this.phase === 'work' ? 'text-green-600' : 'text-blue-600'}">
                        ${this.phase === 'work' ? '🍅 Work Time' : '☕ Break Time'}
                    </div>
                    <div class="text-6xl font-mono font-bold mb-4">${this.formatTime(this.timeLeft)}</div>
                    <div class="text-sm text-gray-600 mb-4">Completed: ${this.completedPomodoros} pomodoros</div>
                    <div class="space-x-2">
                        ${!this.isRunning ? html`
                            <button @click=${this.start} class="btn-primary">Start</button>
                        ` : html`
                            <button @click=${this.pause} class="btn-secondary">Pause</button>
                        `}
                        <button @click=${this.reset} class="btn-secondary">Reset</button>
                        <button @click=${this.complete} class="btn-secondary">Skip</button>
                    </div>
                </div>
                <div class="text-sm text-gray-600">
                    <p><strong>Pomodoro Technique:</strong></p>
                    <ul class="list-disc list-inside mt-2">
                        <li>Work for 25 minutes</li>
                        <li>Take a 5-minute break</li>
                        <li>After 4 pomodoros, take a longer break (15-30 min)</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pomodoro-timer': PomodoroTimer;
    }
}
