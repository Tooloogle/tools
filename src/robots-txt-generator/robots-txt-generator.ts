import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import robotsTxtGeneratorStyles from './robots-txt-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';

@customElement('robots-txt-generator')
export class RobotsTxtGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    robotsTxtGeneratorStyles];

  @property({ type: String }) userAgent = '*';
  @property({ type: Boolean }) allowAll = false;
  @property({ type: Boolean }) disallowAll = false;
  @property({ type: String }) disallowPaths = '';
  @property({ type: String }) allowPaths = '';
  @property({ type: String }) sitemapUrl = '';
  @property({ type: String }) outputText = '';

  override connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private handleUserAgent(e: CustomEvent) {
    this.userAgent = e.detail.value || '*';
    this.process();
  }

  private handleAllowAll(e: CustomEvent) {
    this.allowAll = (e.target as HTMLInputElement).checked;
    if (this.allowAll) {
      this.disallowAll = false;
    }

    this.process();
  }

  private handleDisallowAll(e: CustomEvent) {
    this.disallowAll = (e.target as HTMLInputElement).checked;
    if (this.disallowAll) {
      this.allowAll = false;
    }

    this.process();
  }

  private handleDisallowPaths(e: CustomEvent) {
    this.disallowPaths = e.detail.value;
    this.process();
  }

  private handleAllowPaths(e: CustomEvent) {
    this.allowPaths = e.detail.value;
    this.process();
  }

  private handleSitemap(e: CustomEvent) {
    this.sitemapUrl = e.detail.value;
    this.process();
  }

  private process() {
    let output = `User-agent: ${this.userAgent}\n`;

    if (this.allowAll) {
      output += 'Allow: /\n';
    } else if (this.disallowAll) {
      output += 'Disallow: /\n';
    } else {
      if (this.disallowPaths) {
        const paths = this.disallowPaths.split('\n').filter(p => p.trim());
        paths.forEach(path => {
          output += `Disallow: ${path.trim()}\n`;
        });
      }

      if (this.allowPaths) {
        const paths = this.allowPaths.split('\n').filter(p => p.trim());
        paths.forEach(path => {
          output += `Allow: ${path.trim()}\n`;
        });
      }
    }

    if (this.sitemapUrl) {
      output += `\nSitemap: ${this.sitemapUrl}`;
    }

    this.outputText = output;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderUserAgentInput()} ${this.renderAllowDisallowCheckboxes()}
        ${this.renderPathInputs()} ${this.renderSitemapInput()}
        ${this.renderOutput()}
      </div>
    `;
  }

  private renderUserAgentInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">User-Agent:</label>
        <t-input placeholder="*" class="w-full"></t-input>
      </div>
    `;
  }

  private renderAllowDisallowCheckboxes() {
    return html`
      <div class="flex gap-4">
        <label class="flex items-center">
          <input
            type="checkbox"
            .checked=${this.allowAll}
            @change=${this.handleAllowAll}
          />
          <span class="ml-2">Allow All</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            .checked=${this.disallowAll}
            @change=${this.handleDisallowAll}
          />
          <span class="ml-2">Disallow All</span>
        </label>
      </div>
    `;
  }

  private renderPathInputs() {
    return !this.allowAll && !this.disallowAll
      ? html`
          <div>
            <label class="block mb-2 font-semibold"
              >Disallow Paths (one per line):</label
            >
            <t-textarea placeholder="/admin&#10;/private&#10;/tmp" class="w-full h-24"></t-textarea>
          </div>

          <div>
            <label class="block mb-2 font-semibold"
              >Allow Paths (one per line):</label
            >
            <t-textarea placeholder="/public&#10;/images" class="w-full h-24"></t-textarea>
          </div>
        `
      : '';
  }

  private renderSitemapInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Sitemap URL (optional):</label>
        <t-input type="url" placeholder="https://example.com/sitemap.xml" class="w-full"></t-input>
      </div>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Generated robots.txt:</label>
        <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
        ${this.outputText
          ? html`<t-copy-button
              .text=${this.outputText}
              .isIcon=${false}
            ></t-copy-button>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'robots-txt-generator': RobotsTxtGenerator;
  }
}
