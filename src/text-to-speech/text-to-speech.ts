import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import textToSpeechStyles from './text-to-speech.css.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-button/t-button.js';
import '../t-input/t-input.js';
import '../t-textarea/t-textarea.js';

@customElement('text-to-speech')
export class TextToSpeech extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, textToSpeechStyles];

    @property({ type: String }) text = '';
    @state() isSpeaking = false;
    @state() availableVoices: SpeechSynthesisVoice[] = [];
    @property({ type: String }) selectedVoice = '';
    @property({ type: Number }) rate = 1;
    @property({ type: Number }) pitch = 1;

    private synth: SpeechSynthesis = isBrowser() ? window.speechSynthesis : null as unknown as SpeechSynthesis;

    connectedCallback(): void {
        super.connectedCallback();
        this.updateVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = this.updateVoices.bind(this);
        }
    }

    updateVoices() {
        this.availableVoices = this.synth.getVoices();
        if (this.availableVoices.length > 0) {
            this.selectedVoice = this.availableVoices[0].name;
        }
    }

    handleTextInputChange(event: Event) {
        const inputElement = event.target as HTMLTextAreaElement;
        this.text = inputElement.value;
    }

    handleFileUpload(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
            const file = inputElement.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.text = e.target?.result as string;
            };

            reader.readAsText(file);
        }
    }

    handleVoiceChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedVoice = selectElement.value;
    }

    handleRateChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.rate = parseFloat(inputElement.value);
    }

    handlePitchChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.pitch = parseFloat(inputElement.value);
    }

    speak() {
        if (this.isSpeaking) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(this.text);
        const selectedVoice = this.availableVoices.find(voice => voice.name === this.selectedVoice);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = this.rate;
        utterance.pitch = this.pitch;

        utterance.onstart = () => {
            this.isSpeaking = true;
        };

        utterance.onend = () => {
            this.isSpeaking = false;
        };

        this.synth.speak(utterance);
    }

    stop() {
        this.synth.cancel();
        this.isSpeaking = false;
    }

    private getVoiceOptions() {
        return this.availableVoices.map(voice =>
            html`<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
        );
    }

    render() {
        return html`
            <div class="text-to-speech">
                <div class="editor mb-4">
                <label for="text">Text:</label>
                <t-textarea placeholder="Enter text to convert to speech" rows="10" .value="${String(this.text)}" @t-input="${this.handleTextInputChange}"></t-textarea>
                <input class="file-input" type="file" @change="${this.handleFileUpload}" />
                </div>
                <div class="controls mb-4">
                <label for="voice">Voice:</label>
                <select id="voice" class="form-input" @change="${this.handleVoiceChange}">
                    ${this.getVoiceOptions()}
                </select>
                <label for="rate">Rate:</label>
                <input
                    id="rate"
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    .value="${this.rate}"
                    @input="${this.handleRateChange}"
                />
                <label for="pitch">Pitch:</label>
                <input
                    id="pitch"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    .value="${this.pitch}"
                    @input="${this.handlePitchChange}"
                />
                </div>
                <div class="actions">
                <t-button variant="green" @click="${this.speak}" ?disabled=${this.isSpeaking} class="btn-sm">Speak</t-button>
                <t-button variant="red" @click="${this.stop}" ?disabled=${!this.isSpeaking} class="btn-sm">Stop</t-button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'text-to-speech': TextToSpeech;
    }
}
