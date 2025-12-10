import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import htaccessGeneratorStyles from './htaccess-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('htaccess-generator')
export class HtaccessGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    htaccessGeneratorStyles];

  @property({ type: Boolean }) enableWwwRedirect = false;
  @property({ type: Boolean }) enableHttpsRedirect = false;
  @property({ type: Boolean }) enableCompression = false;
  @property({ type: Boolean }) enableCaching = false;
  @property({ type: String }) customRedirects = '';
  @property({ type: String }) outputText = '';

  override connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private handleCheckbox(field: string) {
    return (e: Event) => {
      (this as any)[field] = (e.target as HTMLInputElement).checked;
      this.process();
    };
  }

  private handleRedirects(e: CustomEvent) {
    this.customRedirects = e.detail.value;
    this.process();
  }

  private process() {
    let output = '# Apache .htaccess Configuration\n\n';

    if (this.enableWwwRedirect) {
      output += '# Redirect to www version\n';
      output += 'RewriteEngine On\n';
      output += 'RewriteCond %{HTTP_HOST} !^www\\. [NC]\n';
      output += 'RewriteRule ^(.*)$ http://www.%{HTTP_HOST}/$1 [R=301,L]\n\n';
    }

    if (this.enableHttpsRedirect) {
      output += '# Force HTTPS\n';
      output += 'RewriteEngine On\n';
      output += 'RewriteCond %{HTTPS} off\n';
      output +=
        'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n';
    }

    if (this.enableCompression) {
      output += '# Enable GZIP Compression\n';
      output += '<IfModule mod_deflate.c>\n';
      output +=
        '  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript\n';
      output += '</IfModule>\n\n';
    }

    if (this.enableCaching) {
      output += '# Browser Caching\n';
      output += '<IfModule mod_expires.c>\n';
      output += '  ExpiresActive On\n';
      output += '  ExpiresByType image/jpg "access plus 1 year"\n';
      output += '  ExpiresByType image/jpeg "access plus 1 year"\n';
      output += '  ExpiresByType image/gif "access plus 1 year"\n';
      output += '  ExpiresByType image/png "access plus 1 year"\n';
      output += '  ExpiresByType text/css "access plus 1 month"\n';
      output +=
        '  ExpiresByType application/javascript "access plus 1 month"\n';
      output += '</IfModule>\n\n';
    }

    if (this.customRedirects.trim()) {
      output += '# Custom Redirects\n';
      output += 'RewriteEngine On\n';
      const redirects = this.customRedirects.split('\n').filter(r => r.trim());
      redirects.forEach(redirect => {
        const parts = redirect.trim().split(/\s+/);
        if (parts.length >= 2) {
          output += `Redirect 301 ${parts[0]} ${parts[1]}\n`;
        }
      });
      output += '\n';
    }

    this.outputText = output.trim();
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderCheckboxes()} ${this.renderRedirectsInput()}
        ${this.renderOutput()}
      </div>
    `;
  }

  private renderCheckboxes() {
    return html`
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="checkbox"
            .checked=${this.enableWwwRedirect}
            @change=${this.handleCheckbox('enableWwwRedirect')}
          />
          <span class="ml-2">Redirect to www version</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            .checked=${this.enableHttpsRedirect}
            @change=${this.handleCheckbox('enableHttpsRedirect')}
          />
          <span class="ml-2">Force HTTPS</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            .checked=${this.enableCompression}
            @change=${this.handleCheckbox('enableCompression')}
          />
          <span class="ml-2">Enable GZIP compression</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            .checked=${this.enableCaching}
            @change=${this.handleCheckbox('enableCaching')}
          />
          <span class="ml-2">Enable browser caching</span>
        </label>
      </div>
    `;
  }

  private renderRedirectsInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold"
          >Custom Redirects (old-url new-url, one per line):</label
        >
        <t-textarea placeholder="/old-page.html /new-page.html&#10;/about-us.html /about" class="w-full h-24"></t-textarea>
      </div>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Generated .htaccess:</label>
        <t-textarea ?readonly=${true} class="w-full h-64"></t-textarea>
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
    'htaccess-generator': HtaccessGenerator;
  }
}
