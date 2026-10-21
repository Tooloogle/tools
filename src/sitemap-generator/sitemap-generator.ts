import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import sitemapGeneratorStyles from './sitemap-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';
import tCopyButtonStyles from '../t-copy-button/t-copy-button.css.js';

@customElement('sitemap-generator')
export class SitemapGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    tCopyButtonStyles,
    sitemapGeneratorStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
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

  private downloadSitemap() {
    const blob = new Blob([this.outputText], {
      type: 'application/xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      link.remove();
      URL.revokeObjectURL(url);
    }
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <label class="block">
          <span class="inline-block py-1">URLs (one per line)</span>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </label>
        <div>
          <div class="flex items-center justify-between">
            <span class="inline-block py-1">Generated XML Sitemap</span>
            <t-copy-button
              .disabled=${!this.outputText}
              .text=${this.outputText}
            ></t-copy-button>
          </div>
          <textarea
            class="form-textarea w-full h-64 font-mono text-sm"
            @input=${this.onOutputChange}
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              type="button"
              class="btn btn-blue btn-sm"
              ?disabled=${!this.outputText}
              @click=${this.downloadSitemap}
            >
              Download sitemap.xml
            </button>
            <t-copy-button
              size="sm"
              .isIcon=${false}
              .text=${this.outputText}
              .disabled=${!this.outputText}
            ></t-copy-button>
          </div>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Enter one URL per line. The sitemap will include current date as
          lastmod, weekly changefreq, and 0.8 priority for all URLs.
        </div>
      </div>
    `;
  }

  private onOutputChange(event: Event) {
    this.outputText = (event.target as HTMLTextAreaElement).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sitemap-generator': SitemapGenerator;
  }
}
