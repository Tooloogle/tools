import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import jsonViewerStyles from './json-viewer.css.js';

interface JsonNode {
    key: string;
    value: any;
    type: string;
    expanded: boolean;
    children: JsonNode[];
}

@customElement('json-viewer')
export class JsonViewer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, jsonViewerStyles];

    @property({ type: String }) jsonString = '';
    @state() jsonObject: JsonNode | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.updateJsonObject();
    }

    private onJsonInputChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.jsonString = inputElement.value;
        this.updateJsonObject();
    }

    private updateJsonObject() {
        try {
            const parsedJson = JSON.parse(this.jsonString);
            this.jsonObject = this.parseJsonToNode('', parsedJson);
        } catch (err) {
            this.jsonObject = null;
        }
    }

    private parseJsonToNode(key: string, value: any): JsonNode {
        const type = Array.isArray(value) ? 'array' : typeof value;
        const node: JsonNode = {
            key,
            value,
            type,
            expanded: false,
            children: [],
        };

        if (type === 'object' && value !== null) {
            node.children = Object.keys(value).map((childKey) => this.parseJsonToNode(childKey, value[childKey]));
        } else if (type === 'array') {
            node.children = value.map((item: any, index: number) => this.parseJsonToNode(index.toString(), item));
        }

        return node;
    }

    private toggleExpand(node: JsonNode) {
        node.expanded = !node.expanded;
        this.requestUpdate();
    }

    private renderJsonNode(node: JsonNode): TemplateResult<1> {
        if (node.type === 'object' || node.type === 'array') {
            return html`
        <div class="json-node">
          <div class="json-key" @click="${() => this.toggleExpand(node)}">
            ${node.expanded ? '▼' : '▶'} ${node.key}: ${node.type === 'array' ? '[]' : '{}'}
          </div>
          ${node.expanded
                    ? html`<div class="json-children">${node.children.map((child) => this.renderJsonNode(child))}</div>`
                    : null}
        </div>
      `;
        } else {
            return html`
        <div class="json-node">
          <div class="json-key">${node.key}:</div>
          <div class="json-value">${JSON.stringify(node.value)}</div>
        </div>
      `;
        }
    }

    private expandAll() {
        const expandAllNodes = (node: JsonNode) => {
            node.expanded = true;
            node.children.forEach(expandAllNodes);
        };

        if (this.jsonObject) {
            expandAllNodes(this.jsonObject);
            this.requestUpdate();
        }
    }

    private collapseAll() {
        const collapseAllNodes = (node: JsonNode) => {
            node.expanded = false;
            node.children.forEach(collapseAllNodes);
        };

        if (this.jsonObject) {
            collapseAllNodes(this.jsonObject);
            this.requestUpdate();
        }
    }

    private formatJson() {
        try {
            const formattedJson = JSON.stringify(JSON.parse(this.jsonString), null, 2);
            this.jsonString = formattedJson;
            this.updateJsonObject();
        } catch (err) {
            // Handle JSON formatting error if needed
        }
    }

    render() {
        return html`
            <div class="json-viewer">
                <div class="editor mb-4">
                    <div class="text-end">
                        <button class="btn btn-blue btn-sm mb-2" @click="${this.formatJson}">Format</button>
                    </div>
                    <textarea
                        class="form-textarea"
                        .value="${this.jsonString}"
                        @input="${this.onJsonInputChange}"
                        placeholder="Enter JSON string"
                        rows="10"
                    ></textarea>
                </div>
                <div class="json-display bg-gray-600 overflow-x-auto relative">
                    ${this.jsonObject ? html`
                        <div class="flex justify-end absolute end-1 top-1">
                            <button class="btn btn-blue btn-sm" @click="${this.expandAll}">Expand All</button>
                            <button class="btn btn-blue btn-sm ml-2" @click="${this.collapseAll}">Collapse All</button>
                        </div>` : ''}
                    ${this.jsonObject ? this.renderJsonNode(this.jsonObject) : 'Invalid JSON'}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-viewer': JsonViewer;
    }
}
