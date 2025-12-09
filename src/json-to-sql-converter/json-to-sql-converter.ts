import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import jsonToSqlConverterStyles from "./json-to-sql-converter.css.js";
import { customElement, property } from "lit/decorators.js";
import inputStyles from "../_styles/input.css.js";
import "../t-copy-button";

@customElement("json-to-sql-converter")
export class JsonToSqlConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    jsonToSqlConverterStyles,
  ];

  @property({ type: String }) inputText = "";
  @property({ type: String }) outputText = "";
  @property({ type: String }) tableName = "my_table";
  @property({ type: String }) errorMessage = "";

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private handleTableNameInput(e: Event) {
    this.tableName = (e.target as HTMLInputElement).value || "my_table";
    this.process();
  }

  // eslint-disable-next-line max-lines-per-function
  private process() {
    this.errorMessage = "";

    if (!this.inputText.trim()) {
      this.outputText = "";
      return;
    }

    try {
      const data = JSON.parse(this.inputText);

      if (!Array.isArray(data)) {
        this.errorMessage = "Input must be a JSON array of objects";
        this.outputText = "";
        return;
      }

      if (data.length === 0) {
        this.errorMessage = "JSON array is empty";
        this.outputText = "";
        return;
      }

      const sqlStatements: string[] = [];

      for (const item of data) {
        if (typeof item !== "object" || item === null) {
          continue;
        }

        const keys = Object.keys(item);
        const values = keys.map(key => {
          const value = item[key];
          if (value === null || value === undefined) {
            return "NULL";
          }

          if (typeof value === "number") {
            return value.toString();
          }

          if (typeof value === "boolean") {
            return value ? "1" : "0";
          }

          // Escape single quotes in strings
          const stringValue = String(value).replace(/'/g, "''");
          return `'${stringValue}'`;
        });

        const sql = `INSERT INTO ${this.tableName} (${keys.join(
          ", "
        )}) VALUES (${values.join(", ")});`;
        sqlStatements.push(sql);
      }

      this.outputText = sqlStatements.join("\n");
    } catch (error) {
      this.errorMessage = `Error: ${
        error instanceof Error ? error.message : "Invalid JSON"
      }`;
      this.outputText = "";
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Table Name:</label>
          <input
            type="text"
            class="form-input w-full"
            placeholder="my_table"
            .value=${this.tableName}
            @input=${this.handleTableNameInput}
          />
        </div>

        <div>
          <label class="block mb-2 font-semibold"
            >JSON Input (Array of Objects):</label
          >
          <textarea
            class="form-textarea w-full h-40"
            placeholder='[{"id": 1, "name": "John", "age": 30}, {"id": 2, "name": "Jane", "age": 25}]'
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
          : ""}

        <div>
          <label class="block mb-2 font-semibold">SQL INSERT Statements:</label>
          <textarea
            class="form-textarea w-full h-40"
            readonly
            .value=${this.outputText}
          ></textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ""}
        </div>
        <p class="text-sm text-gray-600">
          Converts a JSON array of objects to SQL INSERT statements. Each object
          becomes one INSERT statement with properly escaped values.
        </p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "json-to-sql-converter": JsonToSqlConverter;
  }
}
