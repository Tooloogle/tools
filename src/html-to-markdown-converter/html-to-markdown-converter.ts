import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import htmlToMarkdownConverterStyles from './html-to-markdown-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
@customElement('html-to-markdown-converter')
export class HtmlToMarkdownConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    htmlToMarkdownConverterStyles];

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

    // Basic HTML to Markdown conversion
    let markdown = this.inputText;

    // Convert headers
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n\n');

    // Convert bold and italic
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');

    // Convert links
    markdown = markdown.replace(
      /<a\s+href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi,
      '[$2]($1)'
    );

    // Convert images
    markdown = markdown.replace(
      /<img\s+src=["'](.*?)["']\s+alt=["'](.*?)["'][^>]*>/gi,
      '![$2]($1)'
    );
    markdown = markdown.replace(
      /<img\s+alt=["'](.*?)["']\s+src=["'](.*?)["'][^>]*>/gi,
      '![$1]($2)'
    );

    // Convert lists
    markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
    markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<ol[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ol>/gi, '\n');

    // Convert paragraphs and line breaks
    markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Convert code
    markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    markdown = markdown.replace(/<pre>(.*?)<\/pre>/gi, '```\n$1\n```');

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");

    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    this.outputText = markdown.trim();
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">HTML Input:</label>
          <t-textarea placeholder="&lt;h1&gt;Hello World&lt;/h1&gt;&#10;&lt;p&gt;This is &lt;strong&gt;bold&lt;/strong&gt; and &lt;em&gt;italic&lt;/em&gt; text.&lt;/p&gt;" class="w-full h-40"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Markdown Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-40"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Converts HTML to Markdown syntax. Supports headings, lists, bold,
          italic, links, images, and code.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'html-to-markdown-converter': HtmlToMarkdownConverter;
  }
}
