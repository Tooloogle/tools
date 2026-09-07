import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonToYamlConverterStyles from './json-to-yaml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';
@customElement('json-to-yaml-converter')
export class JsonToYamlConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    jsonToYamlConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) errorMessage = '';

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

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      this.errorMessage = '';
      return;
    }

    try {
      const jsonObj = JSON.parse(this.inputText);
      this.outputText = yaml.dump(jsonObj, { indent: 2, lineWidth: -1 });
      this.errorMessage = '';
    } catch (error) {
      this.outputText = '';
      this.errorMessage = `Error: ${
        error instanceof Error ? error.message : 'Invalid JSON'
      }`;
    }
  }

  override render() {
    const hasOutput = Boolean(this.outputText);

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">JSON Input:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder='Enter JSON... e.g., {"name": "John", "age": 30}'
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
        ${this.errorMessage
          ? html`
              <div
                class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded"
              >
                ${this.errorMessage}
              </div>
            `
          : ''}
        <div>
          <label class="block mb-2 font-semibold">YAML Output:</label>
          <textarea
            class="form-textarea w-full h-32 font-mono text-sm"
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
    'json-to-yaml-converter': JsonToYamlConverter;
  }
}
