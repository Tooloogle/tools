import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import xmlToJsonConverterStyles from "./xml-to-json-converter.css.js";
import "../t-file-dropzone/index.js";
import "../t-copy-button/index.js";
import type { TFileDropzoneChangeDetail } from "../t-file-dropzone/t-file-dropzone.js";

interface JsonObject {
  [key: string]: unknown;
  "@attributes"?: Record<string, string>;
  "#text"?: string;
}

@customElement("xml-to-json-converter")
export class XmlToJsonConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    xmlToJsonConverterStyles];

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

  private xmlToJson(xml: string): JsonObject | string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      throw new Error("Invalid XML format. Please check your XML syntax.");
    }

    return this.xmlNodeToJson(xmlDoc.documentElement);
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

  private process() {
    this.error = "";

    if (!this.inputText.trim()) {
      this.outputText = "";
      return;
    }

    try {
      const jsonObj = this.xmlToJson(this.inputText);
      this.outputText = JSON.stringify(jsonObj, null, 2);
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Failed to parse XML.";
      this.outputText = "";
    }
  }

  private downloadJson(): void {
    if (!this.outputText) {
      return;
    }

    const blob = new Blob([this.outputText], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = this.file
      ? this.file.name.replace(/\.[^/.]+$/, ".json")
      : "output.json";
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
          <label class="block mb-2 font-semibold">XML Input:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            placeholder="&lt;note&gt;&lt;to&gt;Tove&lt;/to&gt;&lt;from&gt;Jani&lt;/from&gt;&lt;/note&gt;"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept="application/xml,text/xml,.xml"
            label="Drop an XML file here or click to browse"
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
          <label class="block mb-2 font-semibold">JSON Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadJson}
            >
              Download JSON
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
    "xml-to-json-converter": XmlToJsonConverter;
  }
}