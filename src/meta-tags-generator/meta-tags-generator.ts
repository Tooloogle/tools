import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import metaTagsGeneratorStyles from './meta-tags-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';

@customElement('meta-tags-generator')
export class MetaTagsGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    metaTagsGeneratorStyles];

  @property({ type: String }) title = '';
  @property({ type: String }) description = '';
  @property({ type: String }) keywords = '';
  @property({ type: String }) author = '';
  @property({ type: String }) viewport =
    'width=device-width, initial-scale=1.0';
  @property({ type: String }) outputText = '';

  override connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private handleInput(field: string) {
    return (e: Event) => {
      (this as any)[field] = (
        e.target as HTMLInputElement | HTMLTextAreaElement
      ).value;
      this.process();
    };
  }

  private process() {
    let output = '';

    if (this.title) {
      output += `<title>${this.escapeHtml(this.title)}</title>\n`;
    }

    if (this.description) {
      output += `<meta name="description" content="${this.escapeHtml(
        this.description
      )}">\n`;
    }

    if (this.keywords) {
      output += `<meta name="keywords" content="${this.escapeHtml(
        this.keywords
      )}">\n`;
    }

    if (this.author) {
      output += `<meta name="author" content="${this.escapeHtml(
        this.author
      )}">\n`;
    }

    if (this.viewport) {
      output += `<meta name="viewport" content="${this.escapeHtml(
        this.viewport
      )}">\n`;
    }

    output += '<meta charset="UTF-8">\n';
    output += '<meta http-equiv="X-UA-Compatible" content="IE=edge">';

    this.outputText = output;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderInputFields()} ${this.renderOutput()}
      </div>
    `;
  }

  private renderInputFields() {
    return html`
      ${this.renderTitleInput()} ${this.renderDescriptionInput()}
      ${this.renderKeywordsInput()} ${this.renderAuthorInput()}
      ${this.renderViewportInput()}
    `;
  }

  private renderTitleInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Page Title:</label>
        <t-input placeholder="My Website - Home" class="w-full"></t-input>
      </div>
    `;
  }

  private renderDescriptionInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Description:</label>
        <t-textarea placeholder="A brief description of your page for search engines" class="w-full h-20"></t-textarea>
      </div>
    `;
  }

  private renderKeywordsInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold"
          >Keywords (comma-separated):</label
        >
        <t-input placeholder="web development, HTML, CSS, JavaScript" class="w-full"></t-input>
      </div>
    `;
  }

  private renderAuthorInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Author:</label>
        <t-input placeholder="Your Name" class="w-full"></t-input>
      </div>
    `;
  }

  private renderViewportInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Viewport:</label>
        <t-input class="w-full"></t-input>
      </div>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold"
          >Generated HTML Meta Tags:</label
        >
        <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
        ${this.outputText
          ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meta-tags-generator': MetaTagsGenerator;
  }
}
