import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import jsonViewerStyles from './json-viewer.css.js';
import '../t-button';
import '../t-textarea';

interface JsonNode {
    key: string;
    value: unknown;
    type: string;
    expanded: boolean;
    children: JsonNode[];
}

@customElement('json-viewer')
export class JsonViewer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonViewerStyles];

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

    private parseJsonToNode(key: string, value: unknown): JsonNode {
        const type = Array.isArray(value) ? 'array' : typeof value;
        const node: JsonNode = {
            key,
            value,
            type,
            expanded: false,
            children: [],
        };

        if (type === 'object' && value !== null) {
            const objValue = value as Record<string, unknown>;
            node.children = Object.keys(objValue).map((childKey) => this.parseJsonToNode(childKey, objValue[childKey]));
        } else if (type === 'array') {
            const arrValue = value as unknown[];
            node.children = arrValue.map((item: unknown, index: number) => this.parseJsonToNode(index.toString(), item));
        }

        return node;
    }

    private toggleExpand(node: JsonNode) {
        node.expanded = !node.expanded;
        this.requestUpdate();
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

    private renderNodeChildren(children: JsonNode[]): TemplateResult[] {
        return children.map(child => this.renderJsonNode(child));
    }

    private renderJsonNode(node: JsonNode): TemplateResult {
        if (node.type === 'object' || node.type === 'array') {
            const childrenTemplates = this.renderNodeChildren(node.children);
            return html`
            <div class="json-node">
                <div class="json-key" @click=${this.toggleExpand.bind(this, node)}>
                    ${node.expanded ? '▼' : '▶'} ${node.key}: ${node.type === 'array' ? '[]' : '{}'}
                </div>
                ${node.expanded ? html`<div class="json-children">${childrenTemplates}</div>` : null}
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

    render() {
        const hasJsonObject = !!this.jsonObject;
        const controlButtons = hasJsonObject ? html`
        <div class="flex justify-end absolute end-1 top-1">
            <t-button variant="blue" class="btn-sm">Expand All</t-button>
            <t-button variant="blue" class="btn-sm">Collapse All</t-button>
        </div>
    ` : null;

        const jsonContent = hasJsonObject && this.jsonObject
            ? this.renderJsonNode(this.jsonObject)
            : 'Invalid JSON';

        return html`
        <div class="json-viewer">
            <div class="editor mb-4">
                <div class="text-end">
                    <t-button variant="blue" class="btn-sm">Format</t-button>
                </div>
                <t-textarea placeholder="Enter JSON string" rows="10" .value=${String(this.jsonString)} @t-input=${this.onJsonInputChange}></t-textarea>
            </div>
            <div class="json-display bg-gray-600 overflow-x-auto relative">
                ${controlButtons}
                ${jsonContent}
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