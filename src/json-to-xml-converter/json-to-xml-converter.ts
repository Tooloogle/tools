import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import inputStyles from "../_styles/input.css.js";
import buttonStyles from "../_styles/button.css.js";
import jsonToXmlConverterStyles from "./json-to-xml-converter.css.js";
import { isBrowser } from "../_utils/DomUtils.js";

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
export class JsonToXmlConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    jsonToXmlConverterStyles,
  ];

  @property({ type: Object }) file: File | null = null;
  @property({ type: String }) error = "";

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
    this.error = "";
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

  private async convert() {
    if (!this.file) return;

    try {
      this.error = "";
      const text = await this.file.text();
      const jsonObj = JSON.parse(text) as JsonObject;

      const { rootName, dataToConvert } = this.determineRootElement(jsonObj);
      const xmlString = this.jsonToXml(dataToConvert, rootName);

      this.downloadXml(xmlString);
    } catch (error) {
      console.error("Conversion failed:", error);
      this.error = "Failed to convert JSON file. Please check if the JSON is valid.";
    }
  }

  private determineRootElement(jsonObj: JsonObject): {
    rootName: string;
    dataToConvert: unknown;
  } {
    const keys = Object.keys(jsonObj);

    if (keys.length === 1) {
      const rootName = keys[0];
      return { rootName, dataToConvert: jsonObj[rootName] };
    }

    return { rootName: "root", dataToConvert: jsonObj };
  }

  private downloadXml(xmlString: string): void {
    if (!this.file || !isBrowser()) return;

    const blob = new Blob([xmlString], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const fileName = this.file.name.replace(/\.[^/.]+$/, ".xml");
    a.download = fileName;
    a.click();
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select a JSON file:</label>
        <input
          type="file"
          accept="application/json,text/json,.json"
          class="form-input"
          @change="${this.handleFileChange}"
        />
        <button
          class="btn btn-blue"
          @click="${this.convert}"
          ?disabled="${!this.file}"
        >
          Convert to XML
        </button>
        ${this.error ? html`<div class="text-rose-500">${this.error}</div>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "json-to-xml-converter": JsonToXmlConverter;
  }
}