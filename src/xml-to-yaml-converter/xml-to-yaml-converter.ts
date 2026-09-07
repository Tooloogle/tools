import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import xmlToYamlConverterStyles from './xml-to-yaml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('xml-to-yaml-converter')
export class XmlToYamlConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    xmlToYamlConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private handleFileUpload(e: CustomEvent<TFileDropzoneChangeDetail>) {
    const file = e.detail.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.inputText = event.target?.result as string;
        this.process();
      };

      reader.readAsText(file);
    }
  }

  private downloadYaml() {
    const blob = new Blob([this.outputText], {
      type: 'text/yaml;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.yaml');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private xmlToJson(xml: string): unknown {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    if (xmlDoc.querySelector('parsererror')) {
      throw new Error('Invalid XML');
    }

    const parseNode = (node: Element): unknown => {
      if (node.children.length === 0) {
        return node.textContent || '';
      }

      const obj: Record<string, unknown> = {};
      const children = Array.from(node.children);

      children.forEach(child => {
        const key = child.tagName;
        const value = parseNode(child);

        // Use an own-property check (not a truthy check) so an empty-string
        // or object first value still triggers array aggregation on duplicates.
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]];
          }

          (obj[key] as unknown[]).push(value);
        } else {
          obj[key] = value;
        }
      });

      return obj;
    };

    return parseNode(xmlDoc.documentElement);
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const json = this.xmlToJson(this.inputText);
      this.outputText = yaml.dump(json);
    } catch (error) {
      this.outputText = `Error: ${(error as Error).message}`;
    }
  }

  override render() {
    const hasOutput =
      Boolean(this.outputText) && !this.outputText.startsWith('Error:');

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
        <div>
          <label class="block mb-2 font-semibold">YAML Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadYaml}
            >
              Download YAML
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
    'xml-to-yaml-converter': XmlToYamlConverter;
  }
}
