import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import sitemapGeneratorStyles from './sitemap-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';

@customElement('sitemap-generator')
export class SitemapGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    sitemapGeneratorStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const urls = this.inputText.split('\n').filter(url => url.trim());
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap +=
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      urls.forEach(url => {
        const trimmedUrl = url.trim();
        if (trimmedUrl) {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${this.escapeXml(trimmedUrl)}</loc>\n`;
          sitemap += `    <lastmod>${
            new Date().toISOString().split('T')[0]
          }</lastmod>\n`;
          sitemap += '    <changefreq>weekly</changefreq>\n';
          sitemap += '    <priority>0.8</priority>\n';
          sitemap += '  </url>\n';
        }
      });

      sitemap += '</urlset>';
      this.outputText = sitemap;
    } catch (error) {
      this.outputText = `Error: ${(error as Error).message}`;
    }
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">URLs (one per line):</label>
          <t-textarea placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact" class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Generated XML Sitemap:</label>
          <t-textarea ?readonly=${true} class="w-full h-64"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Enter one URL per line. The sitemap will include current date as
          lastmod, weekly changefreq, and 0.8 priority for all URLs.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sitemap-generator': SitemapGenerator;
  }
}
