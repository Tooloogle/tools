import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import robotsTxtGeneratorStyles from './robots-txt-generator.css.js';
import { customElement, state } from 'lit/decorators.js';
import '../t-copy-button/index.js';

interface RobotsGroup {
  userAgent: string;
  mode: 'custom' | 'allowAll' | 'disallowAll';
  disallow: string;
  allow: string;
}

function emptyGroup(): RobotsGroup {
  return { userAgent: '*', mode: 'custom', disallow: '', allow: '' };
}

@customElement('robots-txt-generator')
export class RobotsTxtGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    robotsTxtGeneratorStyles];

  @state() groups: RobotsGroup[] = [emptyGroup()];
  @state() sitemapUrl = '';
  @state() outputText = '';

  override connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private onGroupField(e: Event) {
    const el = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const index = Number(el.dataset.index);
    const field = el.dataset.field as keyof RobotsGroup;
    this.updateGroup(index, { [field]: el.value } as Partial<RobotsGroup>);
  }

  private onRemoveGroup(e: Event) {
    const index = Number((e.currentTarget as HTMLElement).dataset.index);
    this.removeGroup(index);
  }

  private updateGroup(index: number, patch: Partial<RobotsGroup>) {
    this.groups = this.groups.map((group, i) =>
      i === index ? { ...group, ...patch } : group
    );
    this.process();
  }

  private addGroup() {
    this.groups = [...this.groups, emptyGroup()];
    this.process();
  }

  private removeGroup(index: number) {
    if (this.groups.length <= 1) {
      return;
    }

    this.groups = this.groups.filter((_, i) => i !== index);
    this.process();
  }

  private handleSitemap(e: Event) {
    this.sitemapUrl = (e.target as HTMLInputElement).value;
    this.process();
  }

  private process() {
    let output = this.groups.map(group => this.groupToText(group)).join('\n\n');

    if (this.sitemapUrl.trim()) {
      output += `\n\nSitemap: ${this.sitemapUrl.trim()}`;
    }

    this.outputText = output;
  }

  private groupToText(group: RobotsGroup): string {
    let text = `User-agent: ${group.userAgent.trim() || '*'}\n`;

    if (group.mode === 'allowAll') {
      text += 'Allow: /';
    } else if (group.mode === 'disallowAll') {
      text += 'Disallow: /';
    } else {
      text += this.pathLines(group);
    }

    return text.trimEnd();
  }

  private pathLines(group: RobotsGroup): string {
    const rule = (prefix: string, raw: string) =>
      raw
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `${prefix}: ${p}`);

    return [
      ...rule('Disallow', group.disallow),
      ...rule('Allow', group.allow),
    ].join('\n');
  }

  private downloadRobots() {
    const blob = new Blob([this.outputText], {
      type: 'text/plain;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'robots.txt');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  override render() {
    const groups = this.groups.map((group, index) =>
      this.renderGroup(group, index)
    );

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        ${groups}
        <button class="btn btn-blue btn-sm" @click=${this.addGroup}>
          + Add user-agent group
        </button>
        ${this.renderSitemapInput()} ${this.renderOutput()}
      </div>
    `;
  }

  private renderGroup(group: RobotsGroup, index: number) {
    return html`
      <div class="card space-y-3">
        <div class="flex items-center justify-between">
          <span class="font-semibold">Group ${index + 1}</span>
          ${this.groups.length > 1
            ? html`<button
                class="btn btn-red btn-sm"
                data-index=${index}
                @click=${this.onRemoveGroup}
              >
                Remove
              </button>`
            : ''}
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">User-Agent:</label>
          <input
            type="text"
            class="form-input w-full"
            placeholder="*"
            data-index=${index}
            data-field="userAgent"
            .value=${group.userAgent}
            @input=${this.onGroupField}
          />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">Rules:</label>
          <select
            class="form-select w-full"
            data-index=${index}
            data-field="mode"
            .value=${group.mode}
            @change=${this.onGroupField}
          >
            <option value="custom">Custom paths</option>
            <option value="allowAll">Allow all (Allow: /)</option>
            <option value="disallowAll">Disallow all (Disallow: /)</option>
          </select>
        </div>
        ${group.mode === 'custom' ? this.renderPaths(group, index) : ''}
      </div>
    `;
  }

  private renderPaths(group: RobotsGroup, index: number) {
    return html`
      <div>
        <label class="block mb-1 text-sm font-medium"
          >Disallow paths (one per line):</label
        >
        <textarea
          class="form-textarea w-full h-20"
          placeholder="/admin&#10;/private"
          data-index=${index}
          data-field="disallow"
          .value=${group.disallow}
          @input=${this.onGroupField}
        ></textarea>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium"
          >Allow paths (one per line):</label
        >
        <textarea
          class="form-textarea w-full h-20"
          placeholder="/public&#10;/images"
          data-index=${index}
          data-field="allow"
          .value=${group.allow}
          @input=${this.onGroupField}
        ></textarea>
      </div>
    `;
  }

  private renderSitemapInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Sitemap URL (optional):</label>
        <input
          type="url"
          class="form-input w-full"
          placeholder="https://example.com/sitemap.xml"
          .value=${this.sitemapUrl}
          @input=${this.handleSitemap}
        />
      </div>
    `;
  }

  private renderOutput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Generated robots.txt:</label>
        <textarea
          class="form-textarea w-full h-32 font-mono text-sm"
          readonly
          .value=${this.outputText}
        ></textarea>
        <div class="flex items-center justify-end gap-2 py-2">
          <button
            class="btn btn-blue btn-sm"
            ?disabled=${!this.outputText}
            @click=${this.downloadRobots}
          >
            Download robots.txt
          </button>
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
    'robots-txt-generator': RobotsTxtGenerator;
  }
}
