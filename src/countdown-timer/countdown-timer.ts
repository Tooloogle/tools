import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import countdownTimerStyles from './countdown-timer.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('countdown-timer')
export class CountdownTimer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, countdownTimerStyles];

    @property({ type: Number }) targetTime = 0;
    @property({ type: String }) display = '00:00:00';
    @property({ type: Boolean }) isRunning = false;
    private intervalId: number | null = null;

    connectedCallback() {
        super.connectedCallback();
        
        if (isBrowser()) {
            // Check for query parameters
            const params = new URLSearchParams(window.location.search);
            const minutes = params.get('minutes') || params.get('m');
            const seconds = params.get('seconds') || params.get('s');
            
            if (minutes || seconds) {
                const m = parseInt(minutes || '0');
                const s = parseInt(seconds || '0');
                this.targetTime = Date.now() + (m * 60 + s) * 1000;
                this.start();
            }
        }
    }

    private start() {
        if (!isBrowser() || this.isRunning) {
            return;
        }
        
        this.isRunning = true;
        this.intervalId = window.setInterval(() => {
            const remaining = Math.max(0, this.targetTime - Date.now());
            
            if (remaining === 0) {
                this.stop();
                return;
            }
            
            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            this.display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 100);
    }

    private stop() {
        this.isRunning = false;
        if (this.intervalId !== null && isBrowser()) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private setTimer(minutes: number) {
        this.stop();
        this.targetTime = Date.now() + minutes * 60000;
        this.start();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stop();
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-6xl font-mono font-bold text-blue-600 mb-4">${this.display}</div>
                    <div class="text-sm text-gray-600">Use query params: ?minutes=5 or ?m=5&s=30</div>
                </div>
                <div class="flex gap-2 flex-wrap justify-center">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded" @click=${() => this.setTimer(1)}>1 min</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded" @click=${() => this.setTimer(5)}>5 min</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded" @click=${() => this.setTimer(10)}>10 min</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded" @click=${() => this.setTimer(15)}>15 min</button>
                    <button class="px-4 py-2 bg-red-500 text-white rounded" @click=${this.stop}>Stop</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'countdown-timer': CountdownTimer;
    }
}