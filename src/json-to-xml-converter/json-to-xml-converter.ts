import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import jsonToXmlConverterStyles from "./json-to-xml-converter.css.js";
import "../t-file-dropzone/index.js";
import "../t-copy-button/index.js";
import type { TFileDropzoneChangeDetail } from "../t-file-dropzone/t-file-dropzone.js";

interface JsonObject {
  [key: string]: unknown;
  "@attributes"?: Record<string, string>;
  "#text"?: string;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonObject
  | JsonValue[];

@customElement("json-to-xml-converter")
export class JsonToXmlConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    jsonToXmlConverterStyles];

  @property({ type: String }) inputText = "";
  @property({ type: String }) outputText = "";
  @property({ type: Object }) file: File | null = null;
  @property({ type: String }) error = "";

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private handleFileUpload(e: CustomEvent<TFileDropzoneChangeDetail>) {
    const file = e.detail.file;
    this.file = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.inputText = event.target?.result as string;
        this.process();
      };

      reader.readAsText(file);
    }
  }

  private jsonToXml(obj: unknown, rootName = "root"): string {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    return xml + this.objectToXml(obj as JsonValue, rootName);
  }

  private objectToXml(obj: JsonValue, nodeName: string): string {
    if (obj === null || obj === undefined) {
      return this.createEmptyElement(nodeName);
    }

    if (this.isPrimitive(obj)) {
      return this.createPrimitiveElement(obj, nodeName);
    }

    if (Array.isArray(obj)) {
      return this.handleArrayValue(obj, nodeName);
    }

    if (typeof obj === "object") {
      return this.handleObjectValue(obj as JsonObject, nodeName);
    }

    return this.createPrimitiveElement(obj, nodeName);
  }

  private createEmptyElement(nodeName: string): string {
    return `<${nodeName}></${nodeName}>`;
  }

  private isPrimitive(obj: JsonValue): obj is string | number | boolean {
    return (
      typeof obj === "string" ||
      typeof obj === "number" ||
      typeof obj === "boolean"
    );
  }

  private createPrimitiveElement(obj: JsonValue, nodeName: string): string {
    const content = this.escapeXml(String(obj));
    return `<${nodeName}>${content}</${nodeName}>`;
  }

  private handleArrayValue(arr: JsonValue[], nodeName: string): string {
    return arr.map(item => this.objectToXml(item, nodeName)).join("\n");
  }

  private handleObjectValue(obj: JsonObject, nodeName: string): string {
    const openingTag = this.buildOpeningTag(nodeName, obj);
    const content = this.buildElementContent(obj);
    const closingTag = `</${nodeName}>`;

    if (content) {
      return `${openingTag}${content}\n${closingTag}`;
    }

    return `${openingTag}${closingTag}`;
  }

  private buildOpeningTag(nodeName: string, obj: JsonObject): string {
    let tag = `<${nodeName}`;

    const attributes = obj["@attributes"];
    if (attributes && typeof attributes === "object") {
      for (const [key, value] of Object.entries(attributes)) {
        tag += ` ${key}="${this.escapeXml(value)}"`;
      }
    }

    return `${tag}>`;
  }

  private buildElementContent(obj: JsonObject): string {
    let content = "";

    const textContent = obj["#text"];
    if (textContent && typeof textContent === "string") {
      content += this.escapeXml(textContent);
    }

    content += this.processChildElements(obj);

    return content;
  }

  private processChildElements(obj: JsonObject): string {
    let content = "";

    for (const [key, value] of Object.entries(obj)) {
      if (this.isSpecialKey(key)) {
        continue;
      }

      content += this.processChildElement(key, value);
    }

    return content;
  }

  private isSpecialKey(key: string): boolean {
    return key === "@attributes" || key === "#text";
  }

  private processChildElement(key: string, value: unknown): string {
    if (Array.isArray(value)) {
      const childElements = value
        .map(item => this.objectToXml(item, key))
        .join("\n");
      return `\n${childElements}`;
    }

    const childElement = this.objectToXml(value as JsonValue, key);
    return `\n${childElement}`;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private process() {
    this.error = "";

    if (!this.inputText.trim()) {
      this.outputText = "";
      return;
    }

    try {
      const parsed = JSON.parse(this.inputText);
      const { rootName, dataToConvert } = this.determineRootElement(parsed);
      this.outputText = this.jsonToXml(dataToConvert, rootName);
    } catch {
      this.error = "Invalid JSON. Please check your input.";
      this.outputText = "";
    }
  }

  private determineRootElement(json: unknown): {
    rootName: string;
    dataToConvert: unknown;
  } {
    if (Array.isArray(json)) {
      return { rootName: "root", dataToConvert: { item: json } };
    }

    if (json && typeof json === "object") {
      const keys = Object.keys(json as Record<string, unknown>);
      if (keys.length === 1) {
        return { rootName: keys[0], dataToConvert: (json as JsonObject)[keys[0]] };
      }

      return { rootName: "root", dataToConvert: json };
    }

    return { rootName: "root", dataToConvert: json };
  }

  private downloadXml(): void {
    if (!this.outputText) {
      return;
    }

    const blob = new Blob([this.outputText], {
      type: "application/xml;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = this.file
      ? this.file.name.replace(/\.[^/.]+$/, ".xml")
      : "output.xml";
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  override render() {
    const hasOutput = Boolean(this.outputText);

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">JSON Input:</label>
          <textarea
            class="form-textarea w-full h-40"
            placeholder='{"note": {"to": "Tove", "from": "Jani"}}'
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept="application/json,text/json,.json"
            label="Drop a JSON file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>
        ${this.error
          ? html`<div
              class="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded"
            >
              ${this.error}
            </div>`
          : ""}
        <div>
          <label class="block mb-2 font-semibold">XML Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadXml}
            >
              Download XML
            </button>
            <t-copy-button .isIcon=${false} .disabled=${!hasOutput} .text=${this.outputText}></t-copy-button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "json-to-xml-converter": JsonToXmlConverter;
  }
}