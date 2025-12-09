import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import speedReadingToolStyles from './speed-reading-tool.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('speed-reading-tool')
export class SpeedReadingTool extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, speedReadingToolStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) currentWord = '';
    @property({ type: Number }) wpm = 300;
    @property({ type: Boolean }) isPlaying = false;
    @property({ type: Number }) currentIndex = 0;
    private words: string[] = [];
    private intervalId: number | null = null;

    private handleInput(e: CustomEvent) {
        this.inputText = e.detail.value;
        this.words = this.inputText.split(/\s+/).filter(w => w.length > 0);
        this.currentIndex = 0;
        this.currentWord = '';
    }

    private play() {
        if (!isBrowser()) {
            return;
        }
        
        this.isPlaying = true;
        const interval = 60000 / this.wpm;
        
        this.intervalId = window.setInterval(() => {
            if (this.currentIndex < this.words.length) {
                this.currentWord = this.words[this.currentIndex];
                this.currentIndex++;
            } else {
                this.stop();
            }
        }, interval);
    }

    private pause() {
        if (this.intervalId !== null && isBrowser()) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.isPlaying = false;
    }

    private stop() {
        this.pause();
        this.currentIndex = 0;
        this.currentWord = '';
    }

    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Text to Read:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Paste text to speed read..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Speed (WPM):</label>
                    <t-input type="number" class="w-full"></t-input> { this.wpm = Number(e.detail.value); }}
                    />
                </div>
                <div class="flex gap-2">
                    <button
                        class="px-4 py-2 bg-blue-500 text-white rounded"
                        ?disabled=${!this.words.length || this.isPlaying}
                        @click=${this.play}
                    >
                        Play
                    </button>
                    <button
                        class="px-4 py-2 bg-yellow-500 text-white rounded"
                        ?disabled=${!this.isPlaying}
                        @click=${this.pause}
                    >
                        Pause
                    </button>
                    <button
                        class="px-4 py-2 bg-red-500 text-white rounded"
                        @click=${this.stop}
                    >
                        Stop
                    </button>
                </div>
                <div class="flex items-center justify-center h-32 bg-gray-100 rounded">
                    <div class="text-4xl font-bold">${this.currentWord || 'Ready'}</div>
                </div>
                <div class="text-sm text-gray-600">
                    Word ${this.currentIndex} of ${this.words.length}
                </div>
            </div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.intervalId !== null && isBrowser()) {
            window.clearInterval(this.intervalId);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'speed-reading-tool': SpeedReadingTool;
    }
}
