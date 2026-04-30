import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import sqlToJsonConverterStyles from './sql-to-json-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import Papa, { ParseError } from 'papaparse';
import '../t-copy-button/index.js';

type Delimiter = '\t' | '|' | ',';

@customElement('sql-to-json-converter')
export class SqlToJsonConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    sqlToJsonConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) errorMessage = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    this.errorMessage = '';

    const trimmed = this.inputText.trim();
    if (!trimmed) {
      this.outputText = '';
      return;
    }

    const headerLine = trimmed.split('\n', 1)[0];
    const delimiter = this.detectDelimiter(headerLine);

    const parsed = this.runPapaParse(trimmed, delimiter);
    if (!parsed) {
      return;
    }

    const fields = (parsed.meta.fields ?? []).filter(f => f.trim());
    if (fields.length === 0) {
      this.errorMessage =
        'No headers found. Use tab, pipe (|), or comma separated format.';
      this.outputText = '';
      return;
    }

    if (parsed.data.length === 0) {
      this.errorMessage = 'Need at least a header row and one data row';
      this.outputText = '';
      return;
    }

    const mismatchRows = this.collectMismatchRows(parsed.errors);
    const rows = this.toRows(parsed.data, fields, mismatchRows);

    if (rows.length === 0) {
      this.errorMessage = 'No valid data rows found';
      this.outputText = '';
      return;
    }

    this.errorMessage = this.buildWarnings(parsed.errors, mismatchRows);
    this.outputText = JSON.stringify(rows, null, 2);
  }

  private buildWarnings(
    errors: ParseError[],
    mismatchRows: Set<number>
  ): string {
    const otherErrors = errors.filter(
      (err) => err.code !== 'TooFewFields' && err.code !== 'TooManyFields'
    );

    const warnings: string[] = [];
    if (mismatchRows.size > 0) {
      warnings.push(
        `skipped ${mismatchRows.size} row(s) with column-count mismatch`
      );
    }

    if (otherErrors.length > 0) {
      warnings.push(
        `${otherErrors.length} parse issue(s): ${otherErrors[0].message}`
      );
    }

    return warnings.length > 0 ? `Warning: ${warnings.join('; ')}` : '';
  }

  private runPapaParse(input: string, delimiter: Delimiter) {
    try {
      return Papa.parse<Record<string, string>>(input, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        // Trim header cells so placeholder-style inputs like `id | name | age`
        // produce clean JSON keys (and stable field lookups).
        transformHeader: (header) => header.trim(),
        // Keep everything as strings so our parseValue() can decide.
        dynamicTyping: false,
      });
    } catch (error) {
      this.errorMessage = `Error parsing input: ${
        error instanceof Error ? error.message : String(error)
      }`;
      this.outputText = '';
      return null;
    }
  }

  private toRows(
    data: Array<Record<string, string>>,
    fields: string[],
    mismatchRows: Set<number>
  ): Array<Record<string, unknown>> {
    const rows: Array<Record<string, unknown>> = [];
    data.forEach((rawRow, idx) => {
      if (mismatchRows.has(idx)) {
        return;
      }

      const obj: Record<string, unknown> = {};
      for (const field of fields) {
        obj[field] = this.parseValue(rawRow[field] ?? '');
      }

      rows.push(obj);
    });
    return rows;
  }

  private detectDelimiter(headerLine: string): Delimiter {
    const counts: Record<Delimiter, number> = {
      '\t': (headerLine.match(/\t/g) ?? []).length,
      '|': (headerLine.match(/\|/g) ?? []).length,
      ',': (headerLine.match(/,/g) ?? []).length,
    };

    // Prefer tab > pipe > comma on ties (tab/pipe are unambiguous in SQL
    // CLI output, comma overlaps with values in plain text). Initializing
    // `max` to -1 ensures the all-zero case (single-column input) still
    // resolves to the first preference (tab).
    const order: Delimiter[] = ['\t', '|', ','];
    let best: Delimiter = order[0];
    let max = -1;
    for (const d of order) {
      if (counts[d] > max) {
        max = counts[d];
        best = d;
      }
    }

    return best;
  }

  private collectMismatchRows(errors: ParseError[]): Set<number> {
    const mismatch = new Set<number>();
    for (const err of errors) {
      if (
        (err.code === 'TooFewFields' || err.code === 'TooManyFields') &&
        typeof err.row === 'number'
      ) {
        mismatch.add(err.row);
      }
    }

    return mismatch;
  }

  private parseValue(raw: string): string | number | boolean | null {
    const value = raw.trim();
    if (value === '') {
      return '';
    }

    // Preserve numeric-looking strings whose leading zero would be lost
    // by parseFloat (zip codes "00210", IDs "007", phone numbers, etc.).
    // Bare "0" / "0.5" / "-0.5" are still coerced to numbers.
    if (/^-?\d+(\.\d+)?$/.test(value) && !/^-?0\d/.test(value)) {
      // Long integer IDs that exceed Number.MAX_SAFE_INTEGER lose
      // precision when coerced; keep them as strings.
      if (/^-?\d+$/.test(value)) {
        const n = Number(value);
        if (!Number.isSafeInteger(n)) {
          return value;
        }

        return n;
      }

      return parseFloat(value);
    }

    const lower = value.toLowerCase();
    if (lower === 'true') {
      return true;
    }

    if (lower === 'false') {
      return false;
    }

    if (lower === 'null') {
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
          <textarea
            class="form-textarea w-full h-40"
            placeholder="id | name | age&#10;1 | John | 30&#10;2 | Jane | 25"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
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
          <textarea
            class="form-textarea w-full h-40"
            readonly
            .value=${this.outputText}
          ></textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>

        <div class="text-sm text-gray-600">
          Converts SQL table results (tab, pipe, or comma separated) to JSON
          array. First row should be headers, followed by data rows. Quoted
          values like <code>"Smith, John"</code> are supported. Numeric
          strings with leading zeros (e.g. zip codes) and integers larger
          than 2<sup>53</sup>&minus;1 are preserved as strings.
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
