import { html, TemplateResult } from 'lit';

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
          <input
            type="text"
            class="form-input"
            name="companyName"
            .value="${companyName}"
            @input="${handleInputChange}"
          />
        </div>

        <div class="input-group">
          <label class="input-label">Brand Color:</label>
          <input
            type="color"
            class="form-input color-input"
            name="companyColor"
            .value="${companyColor}"
            @input="${handleInputChange}"
          />
        </div>
      </div>
      <div class="row">
        <div class="input-group">
          <label class="input-label">Recipient Name:</label>
          <input
            type="text"
            class="form-input"
            name="recipientName"
            .value="${recipientName}"
            @input="${handleInputChange}"
          />
        </div>

        <div class="input-group">
          <label class="input-label">Email Subject:</label>
          <input
            type="text"
            class="form-input"
            name="subject"
            .value="${subject}"
            @input="${handleInputChange}"
          />
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
          <input
            type="text"
            class="form-input"
            name="ctaText"
            .value="${ctaText}"
            @input="${handleInputChange}"
          />
        </div>

        <div class="input-group">
          <label class="input-label">CTA Button URL:</label>
          <input
            type="url"
            class="form-input"
            name="ctaUrl"
            .value="${ctaUrl}"
            @input="${handleInputChange}"
          />
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
            <input
              type="text"
              class="form-input"
              name="eventDate"
              placeholder="e.g., Friday, March 15, 2024"
              .value="${eventDate}"
              @input="${handleInputChange}"
            />
          </div>

          <div class="input-group">
            <label class="input-label">Event Time:</label>
            <input
              type="text"
              class="form-input"
              name="eventTime"
              placeholder="e.g., 6:00 PM - 9:00 PM"
              .value="${eventTime}"
              @input="${handleInputChange}"
            />
          </div>

          <div class="input-group">
            <label class="input-label">Event Location:</label>
            <input
              type="text"
              class="form-input"
              name="eventLocation"
              placeholder="e.g., Conference Center, 123 Main St"
              .value="${eventLocation}"
              @input="${handleInputChange}"
            />
          </div>
        </div>
      </div>
    `;
  }

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
                <input
                  type="url"
                  class="form-input"
                  name="privacyPolicyUrl"
                  placeholder="Privacy Policy URL"
                  .value="${privacyPolicyUrl}"
                  @input="${handleInputChange}"
                />
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
                <input
                  type="url"
                  class="form-input"
                  name="termsConditionsUrl"
                  placeholder="Terms &amp; Conditions URL"
                  .value="${termsConditionsUrl}"
                  @input="${handleInputChange}"
                />
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

      <ul class="info">
        <li>
          Generates responsive email templates compatible with major email
          clients
        </li>
        <li>
          Company name is automatically updated in subject lines when changed
        </li>
        <li>
          Customizable footer links for legal compliance (Privacy Policy, Terms
          &amp; Conditions)
        </li>
        <li>Templates are mobile-friendly with responsive design</li>
        <li>Paste your HTML directly with proper tags</li>
        <li>
          For invitation emails, fill in event details in the dedicated fields
        </li>
        <li>Use [Company] and [Name] as placeholders in custom content</li>
        <li>Test your emails across different clients before sending</li>
      </ul>
    `;
  }
}
