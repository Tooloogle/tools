import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import letterCounterStyles from './letter-counter.css.js';
import { customElement, state } from 'lit/decorators.js';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  avgWordLength: number;
  readingTime: string;
}

@customElement('letter-counter')
export class LetterCounter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    letterCounterStyles];

  @state() private inputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
  }

  private getStats(): TextStats {
    const text = this.inputText;

    if (!text.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        avgWordLength: 0,
        readingTime: '0 sec',
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text.split('\n').length;
    const avgWordLength = words > 0
      ? Math.round((charactersNoSpaces / words) * 10) / 10
      : 0;

    const minutes = Math.floor(words / 200);
    const seconds = Math.round(((words % 200) / 200) * 60);
    let readingTime = '';

    if (minutes > 0) {
      readingTime = `${minutes} min ${seconds} sec`;
    } else {
      readingTime = `${seconds} sec`;
    }

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      avgWordLength,
      readingTime,
    };
  }

  private renderStat(label: string, value: string | number) {
    return html`
      <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
        <div class="text-2xl font-bold">${value}</div>
        <div class="text-xs text-gray-500">${label}</div>
      </div>
    `;
  }

  override render() {
    const stats = this.getStats();

    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Text</label>
          <textarea
            class="form-textarea w-full h-40"
            placeholder="Type or paste your text here..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${this.renderStat('Characters', stats.characters)}
          ${this.renderStat('No Spaces', stats.charactersNoSpaces)}
          ${this.renderStat('Words', stats.words)}
          ${this.renderStat('Sentences', stats.sentences)}
          ${this.renderStat('Paragraphs', stats.paragraphs)}
          ${this.renderStat('Lines', stats.lines)}
          ${this.renderStat('Avg Word Len', stats.avgWordLength)}
          ${this.renderStat('Reading Time', stats.readingTime)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'letter-counter': LetterCounter;
  }
}
