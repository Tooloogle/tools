import { html, TemplateResult } from 'lit';
import '../t-button';
import '../t-input';

/* eslint-disable max-lines */
export class EmailTemplateRender {
  static renderTemplateSelector(
    templateType: string,
    handleTemplateChange: (e: Event) => void
  ): TemplateResult {
    return html`
      <div class="row">
        <div class="input-group">
          <label class="input-label">Template Type:</label>
          <select class="form-input" @change="${handleTemplateChange}">
            <option value="welcome" ?selected="${templateType === 'welcome'}">
              Welcome Email
            </option>
            <option
              value="newsletter"
              ?selected="${templateType === 'newsletter'}"
            >
              Newsletter
            </option>
            <option
              value="promotional"
              ?selected="${templateType === 'promotional'}"
            >
              Promotional
            </option>
            <option
              value="notification"
              ?selected="${templateType === 'notification'}"
            >
              Notification
            </option>
            <option
              value="invitation"
              ?selected="${templateType === 'invitation'}"
            >
              Invitation
            </option>
          </select>
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line max-lines-per-function
  static renderBasicSettings(
    companyName: string,
    companyColor: string,
    recipientName: string,
    subject: string,
    handleInputChange: (e: Event) => void
  ): TemplateResult {
    return html`
      <div class="row">
        <div class="input-group">
          <label class="input-label">Company Name:</label>
          <t-input .value="${String(companyName)}" @t-input="${handleInputChange}"></t-input>
        </div>

        <div class="input-group">
          <label class="input-label">Brand Color:</label>
          <t-input type="color" .value="${String(companyColor)}" @t-input="${handleInputChange}" class="color-input"></t-input>
        </div>
      </div>
      <div class="row">
        <div class="input-group">
          <label class="input-label">Recipient Name:</label>
          <t-input .value="${String(recipientName)}" @t-input="${handleInputChange}"></t-input>
        </div>

        <div class="input-group">
          <label class="input-label">Email Subject:</label>
          <t-input .value="${String(subject)}" @t-input="${handleInputChange}"></t-input>
        </div>
      </div>
    `;
  }

  static renderCtaSettings(
    ctaText: string,
    ctaUrl: string,
    handleInputChange: (e: Event) => void
  ): TemplateResult {
    return html`
      <div class="row">
        <div class="input-group">
          <label class="input-label">CTA Button Text:</label>
          <t-input .value="${String(ctaText)}" @t-input="${handleInputChange}"></t-input>
        </div>

        <div class="input-group">
          <label class="input-label">CTA Button URL:</label>
          <t-input type="url" .value="${String(ctaUrl)}" @t-input="${handleInputChange}"></t-input>
        </div>
      </div>
    `;
  }

  static renderContentSettings(
    customContent: string,
    handleTextareaChange: (e: Event) => void
  ): TemplateResult {
    return html`
      <div>
        <label class="input-label">Custom Content (HTML):</label>
        <textarea
          class="form-input content-textarea"
          placeholder="Paste your HTML content here, or leave empty to use template default. Use [Company], [Name] as placeholders."
          @input="${handleTextareaChange}"
          .value="${customContent}"
        ></textarea>
        <small class="help-text"
          >You can paste HTML directly here. Use &lt;p&gt;, &lt;h3&gt;,
          &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;em&gt; tags as
          needed.</small
        >
      </div>
    `;
  }

  // eslint-disable-next-line max-lines-per-function
  static renderEventSettings(
    templateType: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    handleInputChange: (e: Event) => void
  ): TemplateResult {
    if (templateType !== 'invitation') {
      return html``;
    }

    return html`
      <div>
        <h4>Event Details</h4>
        <div class="row">
          <div class="input-group">
            <label class="input-label">Event Date:</label>
            <t-input placeholder="e.g., Friday, March 15, 2024" .value="${String(eventDate)}" @t-input="${handleInputChange}"></t-input>
          </div>

          <div class="input-group">
            <label class="input-label">Event Time:</label>
            <t-input placeholder="e.g., 6:00 PM - 9:00 PM" .value="${String(eventTime)}" @t-input="${handleInputChange}"></t-input>
          </div>

          <div class="input-group">
            <label class="input-label">Event Location:</label>
            <t-input placeholder="e.g., Conference Center, 123 Main St" .value="${String(eventLocation)}" @t-input="${handleInputChange}"></t-input>
          </div>
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line max-lines-per-function
  static renderFooterSettings(
    footerText: string,
    includeUnsubscribe: boolean,
    includePrivacyPolicy: boolean,
    includeTermsConditions: boolean,
    privacyPolicyUrl: string,
    termsConditionsUrl: string,
    handleInputChange: (e: Event) => void
  ): TemplateResult {
    return html`
      <div>
        <label class="input-label">Footer Text:</label>
        <textarea
          class="form-input footer-textarea"
          name="footerText"
          @input="${handleInputChange}"
          .value="${footerText}"
        ></textarea>
      </div>

      <div class="footer-section">
        <h4>Footer Links</h4>
        <div>
          <label>
            <input
              type="checkbox"
              name="includeUnsubscribe"
              .checked="${includeUnsubscribe}"
              @change="${handleInputChange}"
            />
            Include Unsubscribe Link
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="includePrivacyPolicy"
              .checked="${includePrivacyPolicy}"
              @change="${handleInputChange}"
            />
            Include Privacy Policy Link
          </label>
          ${includePrivacyPolicy
            ? html`
                <t-input type="url" placeholder="Privacy Policy URL" .value="${String(privacyPolicyUrl)}" @t-input="${handleInputChange}"></t-input>
              `
            : ''}
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="includeTermsConditions"
              .checked="${includeTermsConditions}"
              @change="${handleInputChange}"
            />
            Include Terms &amp; Conditions Link
          </label>
          ${includeTermsConditions
            ? html`
                <t-input type="url" placeholder="Terms &amp; Conditions URL" .value="${String(termsConditionsUrl)}" @t-input="${handleInputChange}"></t-input>
              `
            : ''}
        </div>
      </div>
    `;
  }

  static renderActions(
    isCopied: boolean,
    previewEmail: () => void,
    downloadHtml: () => void,
    copyHtml: () => void
  ): TemplateResult {
    return html`
      <div class="row actions-section">
        <button class="btn" @click="${previewEmail}">Preview Email</button>
        <button class="btn" @click="${downloadHtml}">Download HTML</button>
        <button class="btn btn-secondary" @click="${copyHtml}">
          ${isCopied ? 'Copied🎉!' : 'Copy HTML'}
        </button>
      </div>
    `;
  }

  static renderOutput(generatedHtml: string): TemplateResult {
    return html`
      <div class="output-section">
        <label class="input-label">Generated HTML:</label>
        <textarea
          class="form-input html-output"
          readonly
          .value="${generatedHtml}"
        ></textarea>
      </div>
    `;
  }
}
