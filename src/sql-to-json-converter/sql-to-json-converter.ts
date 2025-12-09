import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import sqlToJsonConverterStyles from './sql-to-json-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';

@customElement('sql-to-json-converter')
export class SqlToJsonConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    sqlToJsonConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) errorMessage = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    this.errorMessage = '';

    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const lines = this.inputText
        .trim()
        .split('\n')
        .filter(line => line.trim());

      if (lines.length < 2) {
        this.errorMessage = 'Need at least a header row and one data row';
        this.outputText = '';
        return;
      }

      const headers = this.parseHeaders(lines[0]);
      if (headers.length === 0) {
        this.errorMessage =
          'No headers found. Use tab, pipe (|), or comma separated format.';
        this.outputText = '';
        return;
      }

      const result = this.parseDataRows(lines.slice(1), headers);

      if (result.length === 0) {
        this.errorMessage = 'No valid data rows found';
        this.outputText = '';
        return;
      }

      this.outputText = JSON.stringify(result, null, 2);
    } catch (error) {
      this.errorMessage = `Error parsing input: ${
        error instanceof Error ? error.message : String(error)
      }`;
      this.outputText = '';
    }
  }

  private parseHeaders(headerLine: string): string[] {
    return headerLine
      .trim()
      .split(/[\t|,]/)
      .map(h => h.trim())
      .filter(h => h);
  }

  private parseDataRows(lines: string[], headers: string[]): any[] {
    const result: any[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        continue;
      }

      const values = trimmedLine.split(/[\t|]/).map(v => v.trim());

      if (values.length !== headers.length) {
        continue;
      }

      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = this.parseValue(values[index]);
      });

      result.push(obj);
    }

    return result;
  }

  private parseValue(value: any): any {
    // Try to parse as number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return parseFloat(value);
    }

    // Check for boolean
    if (value.toLowerCase() === 'true') {
      return true;
    }

    if (value.toLowerCase() === 'false') {
      return false;
    }

    // Check for null
    if (value.toLowerCase() === 'null') {
      return null;
    }

    return value;
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold"
            >SQL Table Format (Tab/Pipe/Comma Separated):</label
          >
          <t-textarea placeholder="id | name | age&#10;1 | John | 30&#10;2 | Jane | 25" class="w-full h-40"></t-textarea>
        </div>

        ${this.errorMessage
          ? html`
              <div class="p-3 bg-red-100 text-red-700 rounded">
                ${this.errorMessage}
              </div>
            `
          : ''}

        <div>
          <label class="block mb-2 font-semibold">JSON Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-40"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>

        <div class="text-sm text-gray-600">
          Converts SQL table results (tab, pipe, or comma separated) to JSON
          array. First row should be headers, followed by data rows.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sql-to-json-converter': SqlToJsonConverter;
  }
}
