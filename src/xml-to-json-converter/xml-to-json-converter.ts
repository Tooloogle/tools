import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import xmlToJsonConverterStyles from "./xml-to-json-converter.css.js";
import '../t-button/t-button.js';
import '../t-input/t-input.js';

interface JsonObject {
  [key: string]: unknown;
  "@attributes"?: Record<string, string>;
  "#text"?: string;
}

@customElement("xml-to-json-converter")
export class XmlToJsonConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    xmlToJsonConverterStyles];

  @property({ type: Object }) file: File | null = null;
  @property({ type: String }) error = "";

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
    this.error = "";
  }

  private xmlToJson(xml: string): JsonObject | string {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");

      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        throw new Error("Invalid XML format. Please check your XML syntax.");
      }

      return this.xmlNodeToJson(xmlDoc.documentElement);
    } catch (error) {
      console.error("XML parsing error:", error);
      throw new Error("Failed to parse XML. The file might be corrupted or invalid.");
    }
  }

  private xmlNodeToJson(node: Element): JsonObject | string {
    const obj: JsonObject = {};

    this.processAttributes(node, obj);

    return this.processChildNodes(node, obj);
  }

  private processAttributes(node: Element, obj: JsonObject): void {
    if (node.attributes.length === 0) {
        return;
    }

    obj["@attributes"] = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      (obj["@attributes"] as Record<string, string>)[attr.name] = attr.value;
    }
  }

  private processChildNodes(
    node: Element,
    obj: JsonObject
  ): JsonObject | string {
    if (!node.hasChildNodes()) {
      return obj;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];

      if (child.nodeType === Node.TEXT_NODE) {
        const textResult = this.processTextNode(child, obj);
        if (typeof textResult === "string") {
          return textResult;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        this.processElementNode(child as Element, obj);
      }
    }

    return obj;
  }

  private processTextNode(
    child: ChildNode,
    obj: JsonObject
  ): JsonObject | string {
    const text = child.textContent?.trim();
    if (!text) {
      return obj;
    }

    if (Object.keys(obj).length === 0) {
      return text;
    }

    obj["#text"] = text;
    return obj;
  }

  private processElementNode(childElement: Element, obj: JsonObject): void {
    const childName = childElement.nodeName;
    const childValue = this.xmlNodeToJson(childElement);

    this.addChildToObject(obj, childName, childValue);
  }

  private addChildToObject(
    obj: JsonObject,
    childName: string,
    childValue: JsonObject | string
  ): void {
    const existingValue = obj[childName];

    if (existingValue !== undefined) {
      if (!Array.isArray(existingValue)) {
        obj[childName] = [existingValue];
      }

      (obj[childName] as unknown[]).push(childValue);
    } else {
      obj[childName] = childValue;
    }
  }

  private async convert() {
    if (!this.file) {
        return;
    }

    try {
      this.error = "";
      const text = await this.file.text();
      const jsonObj = this.xmlToJson(text);
      const jsonString = JSON.stringify(jsonObj, null, 2);

      this.downloadJson(jsonString);
    } catch (error) {
      console.error("Conversion failed:", error);
      this.error = error instanceof Error ? error.message : "Failed to convert XML file. Please check if the XML is valid.";
    }
  }

  private downloadJson(jsonString: string): void {
    if (!this.file) {
        return;
    }

    const blob = new Blob([jsonString], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const fileName = this.file.name.replace(/\.[^/.]+$/, ".json");
    a.download = fileName;
    a.click();
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select an XML file:</label>
        <t-input type="file" @t-change="${this.handleFileChange}"></t-input>
        <t-button variant="blue" ?disabled=${!this.file} @click=${this.convert}>
          Convert to JSON
        </t-button>
        ${this.error ? html`<div class="text-rose-500">${this.error}</div>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "xml-to-json-converter": XmlToJsonConverter;
  }
}