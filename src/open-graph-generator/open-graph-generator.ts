import { html } from "lit";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import openGraphGeneratorStyles from "./open-graph-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import '../t-copy-button/index.js';

@customElement("open-graph-generator")
export class OpenGraphGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    openGraphGeneratorStyles];

  @property({ type: String }) override title = "";
  @property({ type: String }) description = "";
  @property({ type: String }) url = "";
  @property({ type: String }) image = "";
  @property({ type: String }) siteName = "";
  @property({ type: String }) type = "website";
  @property({ type: String }) outputText = "";

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

  // eslint-disable-next-line max-lines-per-function
  private process() {
    let output = "";

    if (this.title) {
      output += `<meta property="og:title" content="${this.escapeHtml(
        this.title
      )}">\n`;
    }

    if (this.description) {
      output += `<meta property="og:description" content="${this.escapeHtml(
        this.description
      )}">\n`;
    }

    if (this.url) {
      output += `<meta property="og:url" content="${this.escapeHtml(
        this.url
      )}">\n`;
    }

    if (this.image) {
      output += `<meta property="og:image" content="${this.escapeHtml(
        this.image
      )}">\n`;
    }

    if (this.siteName) {
      output += `<meta property="og:site_name" content="${this.escapeHtml(
        this.siteName
      )}">\n`;
    }

    if (this.type) {
      output += `<meta property="og:type" content="${this.escapeHtml(
        this.type
      )}">\n`;
    }

    // Add Twitter Card tags
    if (this.title) {
      output += `\n<!-- Twitter Card -->\n`;
      output += `<meta name="twitter:card" content="summary_large_image">\n`;
      output += `<meta name="twitter:title" content="${this.escapeHtml(
        this.title
      )}">\n`;
    }

    if (this.description) {
      output += `<meta name="twitter:description" content="${this.escapeHtml(
        this.description
      )}">\n`;
    }

    if (this.image) {
      output += `<meta name="twitter:image" content="${this.escapeHtml(
        this.image
      )}">`;
    }

    this.outputText = output;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        ${this.renderInputFields()} ${this.renderOutput()}
        ${this.renderHelpText()}
      </div>
    `;
  }

  private renderInputFields() {
    return html` ${this.renderBasicInputs()} ${this.renderTypeSelector()} `;
  }

  private renderBasicInputs() {
    return html`
      ${this.renderTitleAndDescriptionInputs()}
      ${this.renderUrlAndImageInputs()} ${this.renderSiteNameInput()}
    `;
  }

  private renderTitleAndDescriptionInputs() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Title</span>
        <input
          type="text"
          class="form-input w-full"
          placeholder="Page Title"
          .value=${this.title}
          @input=${this.handleInput("title")}
        />
      </label>

      <label class="block">
        <span class="inline-block py-1">Description</span>
        <textarea
          class="form-textarea w-full h-20"
          placeholder="Page description for social media sharing"
          .value=${this.description}
          @input=${this.handleInput("description")}
        ></textarea>
      </label>
    `;
  }

  private renderUrlAndImageInputs() {
    return html`
      <label class="block">
        <span class="inline-block py-1">URL</span>
        <input
          type="url"
          class="form-input w-full"
          placeholder="https://example.com/page"
          .value=${this.url}
          @input=${this.handleInput("url")}
        />
      </label>

      <label class="block">
        <span class="inline-block py-1">Image URL</span>
        <input
          type="url"
          class="form-input w-full"
          placeholder="https://example.com/image.jpg"
          .value=${this.image}
          @input=${this.handleInput("image")}
        />
      </label>
    `;
  }

  private renderSiteNameInput() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Site Name</span>
        <input
          type="text"
          class="form-input w-full"
          placeholder="My Website"
          .value=${this.siteName}
          @input=${this.handleInput("siteName")}
        />
      </label>
    `;
  }

  private renderTypeSelector() {
    return html`
      <label class="block">
        <span class="inline-block py-1">Type</span>
        <select
          class="form-select w-full"
          .value=${this.type}
          @change=${this.handleInput("type")}
        >
          <option value="website">Website</option>
          <option value="article">Article</option>
          <option value="profile">Profile</option>
          <option value="video.movie">Video - Movie</option>
          <option value="music.song">Music - Song</option>
          <option value="book">Book</option>
        </select>
      </label>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <div class="flex items-center justify-between">
          <span class="inline-block py-1">Generated Open Graph Tags</span>
          <t-copy-button
            .disabled=${!this.outputText}
            .text=${this.outputText}
          ></t-copy-button>
        </div>
        <textarea
          class="form-textarea w-full h-48"
          readonly
          .value=${this.outputText}
        ></textarea>
      </div>
    `;
  }

  private renderHelpText() {
    return html`
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Includes both Open Graph and Twitter Card meta tags for optimal social
        media sharing.
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "open-graph-generator": OpenGraphGenerator;
  }
}
