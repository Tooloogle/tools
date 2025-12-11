import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import timezoneConverterStyles from './timezone-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';
@customElement('timezone-converter')
export class TimezoneConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    timezoneConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    const lines = this.inputText.split('\n');
    if (lines.length < 3) {
      this.outputText =
        'Format:\n<time>\n<from_timezone_offset>\n<to_timezone_offset>\n\nExample:\n14:30\n+0\n-5';
      return;
    }

    const time = lines[0];
    const fromOffset = parseFloat(lines[1]);
    const toOffset = parseFloat(lines[2]);

    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      this.outputText = 'Invalid time format. Use HH:MM';
      return;
    }

    const totalMinutes = hours * 60 + minutes - fromOffset * 60 + toOffset * 60;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    this.outputText = `${String(
      newHours < 0 ? newHours + 24 : newHours
    ).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input:</label>
          <t-textarea placeholder="Enter input..." class="w-full h-32" .value="${this.inputText}" @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32" .value="${this.outputText}"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Note: Convert time between timezones
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'timezone-converter': TimezoneConverter;
  }
}
