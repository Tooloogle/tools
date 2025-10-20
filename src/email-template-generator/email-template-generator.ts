import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import emailTemplateGeneratorStyles from './email-template-generator.css.js';
import {
  EmailTemplateUtils,
  TemplateData,
} from './email-template-generator-utils.js';
import {
  EmailTemplateHtml,
  EmailTemplateParams,
} from './email-template-generator-html.js';
import { EmailTemplateRender } from './email-template-generator-render.js';

type EmailTemplateProperty =
  | 'templateType'
  | 'companyName'
  | 'companyColor'
  | 'recipientName'
  | 'subject'
  | 'customContent'
  | 'generatedHtml'
  | 'ctaText'
  | 'ctaUrl'
  | 'footerText'
  | 'isCopied'
  | 'includeUnsubscribe'
  | 'includePrivacyPolicy'
  | 'includeTermsConditions'
  | 'privacyPolicyUrl'
  | 'termsConditionsUrl'
  | 'eventDate'
  | 'eventTime'
  | 'eventLocation';

@customElement('email-template-generator')
export class EmailTemplateGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    emailTemplateGeneratorStyles,
  ];

  @property({ type: String }) templateType = 'welcome';
  @property({ type: String }) companyName = 'Your Company';
  @property({ type: String }) companyColor = '#007bff';
  @property({ type: String }) recipientName = '[Name]';
  @property({ type: String }) subject = '';
  @property({ type: String }) customContent = '';
  @property({ type: String }) generatedHtml = '';
  @property({ type: String }) ctaText = 'Get Started';
  @property({ type: String }) ctaUrl = 'https://example.com';
  @property({ type: String }) footerText =
    'Best regards,<br>The [Company] Team';
  @property({ type: Boolean }) isCopied = false;
  @property({ type: Boolean }) includeUnsubscribe = true;
  @property({ type: Boolean }) includePrivacyPolicy = true;
  @property({ type: Boolean }) includeTermsConditions = true;
  @property({ type: String }) privacyPolicyUrl = 'https://example.com/privacy';
  @property({ type: String }) termsConditionsUrl = 'https://example.com/terms';
  @property({ type: String }) eventDate = '';
  @property({ type: String }) eventTime = '';
  @property({ type: String }) eventLocation = '';

  private get templates(): TemplateData {
    return EmailTemplateUtils.getTemplates(
      this.companyName,
      this.recipientName,
      this.eventDate,
      this.eventTime,
      this.eventLocation
    );
  }

  private handleTemplateChange = (e: Event): void => {
    const select = e.target as HTMLSelectElement;
    this.templateType = select.value;
    this.updateSubjectAndContent();
    this.generateTemplate();
  };

  private handleInputChange = (e: Event): void => {
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    const property = input.name as EmailTemplateProperty;

    if (input.type === 'checkbox') {
      this[property] = (input as HTMLInputElement).checked as never;
    } else {
      this[property] = input.value as never;
    }

    if (property === 'companyName') {
      this.updateSubjectAndContent();
    }

    this.generateTemplate();
  };

  private handleTextareaChange = (e: Event): void => {
    const textarea = e.target as HTMLTextAreaElement;
    this.customContent = textarea.value;
    this.generateTemplate();
  };

  private updateSubjectAndContent(): void {
    const template = this.templates[this.templateType as keyof TemplateData];
    if (template) {
      this.subject = template.subject;
    }
  }

  private generateTemplate(): void {
    const template = this.templates[this.templateType as keyof TemplateData];
    const content = this.customContent || (template ? template.content : '');
    const footerLinks = EmailTemplateUtils.generateFooterLinks(
      this.includeUnsubscribe,
      this.includePrivacyPolicy,
      this.includeTermsConditions,
      this.privacyPolicyUrl,
      this.termsConditionsUrl
    );

    const params: EmailTemplateParams = {
      subject: this.subject,
      companyName: this.companyName,
      companyColor: this.companyColor,
      content,
      ctaText: this.ctaText,
      ctaUrl: this.ctaUrl,
      footerText: this.footerText,
      footerLinks,
      recipientName: this.recipientName,
      eventDate: this.eventDate,
      eventTime: this.eventTime,
      eventLocation: this.eventLocation,
    };

    this.generatedHtml = EmailTemplateHtml.generateTemplate(params);
  }

  private downloadHtml = (): void => {
    EmailTemplateUtils.downloadHtml(this.generatedHtml, this.templateType);
  };

  private handleCopyHtml = (): void => {
    void this.copyHtmlAsync();
  };

  private async copyHtmlAsync(): Promise<void> {
    const success = await EmailTemplateUtils.copyToClipboard(
      this.generatedHtml
    );
    this.isCopied = success;
    if (success) {
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    }
  }

  private previewEmail = (): void => {
    EmailTemplateUtils.previewEmail(this.generatedHtml);
  };

  override firstUpdated(): void {
    this.updateSubjectAndContent();
    this.generateTemplate();
  }

  // eslint-disable-next-line max-lines-per-function
  override render() {
    return html`
      <div class="container">
        ${EmailTemplateRender.renderTemplateSelector(
          this.templateType,
          this.handleTemplateChange
        )}
        ${EmailTemplateRender.renderBasicSettings(
          this.companyName,
          this.companyColor,
          this.recipientName,
          this.subject,
          this.handleInputChange
        )}
        ${EmailTemplateRender.renderCtaSettings(
          this.ctaText,
          this.ctaUrl,
          this.handleInputChange
        )}
        ${EmailTemplateRender.renderContentSettings(
          this.customContent,
          this.handleTextareaChange
        )}
        ${EmailTemplateRender.renderEventSettings(
          this.templateType,
          this.eventDate,
          this.eventTime,
          this.eventLocation,
          this.handleInputChange
        )}
        ${EmailTemplateRender.renderFooterSettings(
          this.footerText,
          this.includeUnsubscribe,
          this.includePrivacyPolicy,
          this.includeTermsConditions,
          this.privacyPolicyUrl,
          this.termsConditionsUrl,
          this.handleInputChange
        )}
        ${EmailTemplateRender.renderActions(
          this.isCopied,
          this.previewEmail,
          this.downloadHtml,
          this.handleCopyHtml
        )}
        ${EmailTemplateRender.renderOutput(this.generatedHtml)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'email-template-generator': EmailTemplateGenerator;
  }
}
