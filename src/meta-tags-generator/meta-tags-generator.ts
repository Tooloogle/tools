import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import metaTagsGeneratorStyles from './meta-tags-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('meta-tags-generator')
export class MetaTagsGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    metaTagsGeneratorStyles];

  @property({ type: String }) override title = '';
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
      (this as unknown as Record<string, unknown>)[field] = (
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
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
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
      <label class="block">
        <span class="inline-block py-1">Page Title</span>
        <input
          type="text"
          class="form-input w-full"
          placeholder="My Website - Home"
          .value=${this.title}
          @input=${this.handleInput('title')}
        />
      </label>
    `;
  }

  private renderDescriptionInput() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Description</span>
        <textarea
          class="form-textarea w-full h-20"
          placeholder="A brief description of your page for search engines"
          .value=${this.description}
          @input=${this.handleInput('description')}
        ></textarea>
      </label>
    `;
  }

  private renderKeywordsInput() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Keywords (comma-separated)</span>
        <input
          type="text"
          class="form-input w-full"
          placeholder="web development, HTML, CSS, JavaScript"
          .value=${this.keywords}
          @input=${this.handleInput('keywords')}
        />
      </label>
    `;
  }

  private renderAuthorInput() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Author</span>
        <input
          type="text"
          class="form-input w-full"
          placeholder="Your Name"
          .value=${this.author}
          @input=${this.handleInput('author')}
        />
      </label>
    `;
  }

  private renderViewportInput() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Viewport</span>
        <input
          type="text"
          class="form-input w-full"
          .value=${this.viewport}
          @input=${this.handleInput('viewport')}
        />
      </label>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <div class="flex items-center justify-between">
          <span class="inline-block py-1">Generated HTML Meta Tags</span>
          <t-copy-button
            .disabled=${!this.outputText}
            .text=${this.outputText}
          ></t-copy-button>
        </div>
        <textarea
          class="form-textarea w-full h-32"
          readonly
          .value=${this.outputText}
        ></textarea>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meta-tags-generator': MetaTagsGenerator;
  }
}
