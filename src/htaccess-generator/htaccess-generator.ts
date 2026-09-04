import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import htaccessGeneratorStyles from './htaccess-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('htaccess-generator')
export class HtaccessGenerator extends WebComponentBase {
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
      (this as unknown as Record<string, unknown>)[field] = (e.target as HTMLInputElement).checked;
      this.process();
    };
  }

  private handleRedirects(e: Event) {
    this.customRedirects = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    let output = '# Apache .htaccess Configuration\n\n';

    if (this.enableWwwRedirect || this.enableHttpsRedirect) {
      output += 'RewriteEngine On\n\n';
    }

    if (this.enableWwwRedirect) {
      output += '# Redirect to www version\n';
      output += 'RewriteCond %{HTTP_HOST} !^www\\. [NC]\n';
      output +=
        'RewriteRule ^(.*)$ %{REQUEST_SCHEME}://www.%{HTTP_HOST}/$1 [R=301,L]\n\n';
    }

    if (this.enableHttpsRedirect) {
      output += '# Force HTTPS\n';
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
      output += this.cachingRules();
    }

    if (this.customRedirects.trim()) {
      output += this.customRedirectRules();
    }

    this.outputText = output.trim();
  }

  private cachingRules(): string {
    return (
      '# Browser Caching\n' +
      '<IfModule mod_expires.c>\n' +
      '  ExpiresActive On\n' +
      '  ExpiresByType image/jpg "access plus 1 year"\n' +
      '  ExpiresByType image/jpeg "access plus 1 year"\n' +
      '  ExpiresByType image/gif "access plus 1 year"\n' +
      '  ExpiresByType image/png "access plus 1 year"\n' +
      '  ExpiresByType text/css "access plus 1 month"\n' +
      '  ExpiresByType application/javascript "access plus 1 month"\n' +
      '</IfModule>\n\n'
    );
  }

  private customRedirectRules(): string {
    let output = '# Custom Redirects\n';
    const redirects = this.customRedirects.split('\n').filter(r => r.trim());
    redirects.forEach(redirect => {
      const parts = redirect.trim().split(/\s+/);
      if (parts.length >= 2) {
        output += `Redirect 301 ${parts[0]} ${parts[1]}\n`;
      } else {
        output += `# Skipped invalid redirect: ${redirect.trim()}\n`;
      }
    });
    return `${output}\n`;
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
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
        <textarea
          class="form-textarea w-full h-24"
          placeholder="/old-page.html /new-page.html&#10;/about-us.html /about"
          .value=${this.customRedirects}
          @input=${this.handleRedirects}
        ></textarea>
      </div>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Generated .htaccess:</label>
        <textarea
          class="form-textarea w-full h-64"
          readonly
          .value=${this.outputText}
        ></textarea>
        <div class="py-2 text-right">
          <t-copy-button
            .text=${this.outputText}
            .isIcon=${false}
            .disabled=${!this.outputText}
          ></t-copy-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'htaccess-generator': HtaccessGenerator;
  }
}
