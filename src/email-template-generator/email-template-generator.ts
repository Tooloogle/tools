import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emailTemplateGeneratorStyles from './email-template-generator.css.js';

@customElement('email-template-generator')
export class EmailTemplateGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, emailTemplateGeneratorStyles];
    
    @property({ type: String }) templateType = 'welcome';
    @property({ type: String }) companyName = 'Your Company';
    @property({ type: String }) companyColor = '#007bff';
    @property({ type: String }) recipientName = '[Name]';
    @property({ type: String }) subject = '';
    @property({ type: String }) customContent = '';
    @property({ type: String }) generatedHtml = '';
    @property({ type: String }) ctaText = 'Get Started';
    @property({ type: String }) ctaUrl = 'https://example.com';
    @property({ type: String }) footerText = 'Best regards,<br>The [Company] Team';
    @property({ type: Boolean }) isCopied = false;
    @property({ type: Boolean }) includeUnsubscribe = true;
    @property({ type: Boolean }) includePrivacyPolicy = true;
    @property({ type: Boolean }) includeTermsConditions = true;
    @property({ type: String }) privacyPolicyUrl = 'https://example.com/privacy';
    @property({ type: String }) termsConditionsUrl = 'https://example.com/terms';
    @property({ type: String }) eventDate = '';
    @property({ type: String }) eventTime = '';
    @property({ type: String }) eventLocation = '';

    private get templates() {
        return {
            welcome: {
                subject: `Welcome to ${this.companyName}!`,
                content: `
                    <h2>Welcome to ${this.companyName}!</h2>
                    <p>Hi ${this.recipientName},</p>
                    <p>Thank you for joining ${this.companyName}. We're excited to have you on board!</p>
                    <p>Here's what you can do next:</p>
                    <ul>
                        <li>Complete your profile setup</li>
                        <li>Explore our features</li>
                        <li>Join our community</li>
                    </ul>
                `
            },
            newsletter: {
                subject: `${this.companyName} Newsletter - [Month] Edition`,
                content: `
                    <h2>Monthly Newsletter</h2>
                    <p>Hi ${this.recipientName},</p>
                    <p>Here are the latest updates from ${this.companyName}:</p>
                    <h3>📰 What's New</h3>
                    <p>We've been busy working on exciting new features and improvements.</p>
                    <h3>🎯 Featured Content</h3>
                    <p>Check out our latest blog posts and resources.</p>
                `
            },
            promotional: {
                subject: `Special Offer from ${this.companyName} - Just for You!`,
                content: `
                    <h2>🎉 Limited Time Offer!</h2>
                    <p>Hi ${this.recipientName},</p>
                    <p>We have an exclusive offer just for you from ${this.companyName}.</p>
                    <p><strong>Get 50% off your next purchase!</strong></p>
                    <p>This offer expires soon, so don't miss out.</p>
                `
            },
            notification: {
                subject: `Important Update from ${this.companyName}`,
                content: `
                    <h2>Important Notification</h2>
                    <p>Hi ${this.recipientName},</p>
                    <p>We wanted to inform you about an important update regarding your ${this.companyName} account.</p>
                    <p>Please take a moment to review this information.</p>
                `
            },
            invitation: {
                subject: `You're Invited! Join ${this.companyName} for ${this.eventDate || '[Event]'}`,
                content: `
                    <h2>🎊 You're Invited!</h2>
                    <p>Hi ${this.recipientName},</p>
                    <p>${this.companyName} is hosting a special event and we'd love for you to join us!</p>
                    <p><strong>Event Details:</strong></p>
                    <ul>
                        <li>Date: ${this.eventDate || '[Event Date]'}</li>
                        <li>Time: ${this.eventTime || '[Event Time]'}</li>
                        <li>Location: ${this.eventLocation || '[Event Location]'}</li>
                    </ul>
                `
            }
        };
    }

    private handleTemplateChange(e: Event) {
        const select = e.target as HTMLSelectElement;
        this.templateType = select.value;
        this.updateSubjectAndContent();
        this.generateTemplate();
    }

    private handleInputChange(e: Event) {
        const input = e.target as HTMLInputElement | HTMLTextAreaElement;
        const property = input.name as keyof this;
        
        if (input.type === 'checkbox') {
            (this as any)[property] = (input as HTMLInputElement).checked;
        } else {
            (this as any)[property] = input.value;
        }
        
        // If company name changed, update subject and regenerate
        if (property === 'companyName') {
            this.updateSubjectAndContent();
        }
        
        this.generateTemplate();
    }

    private handleTextareaChange(e: Event) {
        const textarea = e.target as HTMLTextAreaElement;
        this.customContent = textarea.value;
        this.generateTemplate();
    }

    private updateSubjectAndContent() {
        const template = this.templates[this.templateType as keyof typeof this.templates];
        if (template) {
            this.subject = template.subject;
        }
    }

    private generateFooterLinks() {
        const footerLinks = [];
        
        if (this.includeUnsubscribe) {
            footerLinks.push('<a href="[UNSUBSCRIBE_URL]" style="color: #6c757d;">Unsubscribe</a>');
        }
        
        if (this.includePrivacyPolicy) {
            footerLinks.push(`<a href="${this.privacyPolicyUrl}" style="color: #6c757d;">Privacy Policy</a>`);
        }
        
        if (this.includeTermsConditions) {
            footerLinks.push(`<a href="${this.termsConditionsUrl}" style="color: #6c757d;">Terms & Conditions</a>`);
        }
        
        return footerLinks.length > 0 ? `<p>${footerLinks.join(' | ')}</p>` : '';
    }

    private generateTemplate() {
        const template = this.templates[this.templateType as keyof typeof this.templates];
        const content = this.customContent || (template ? template.content : '');
        const footerLinks = this.generateFooterLinks();
        
        this.generatedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: ${this.companyColor};
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: ${this.companyColor};
            margin-top: 0;
        }
        .content ul {
            padding-left: 20px;
        }
        .content li {
            margin-bottom: 8px;
        }
        .cta-button {
            display: inline-block;
            background-color: ${this.companyColor};
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            font-size: 14px;
            color: #6c757d;
        }
        .footer a {
            color: #6c757d;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 0;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${this.companyName}</h1>
        </div>
        <div class="content">
            ${content
                .replace(/\[Company\]/g, this.companyName)
                .replace(/\[Name\]/g, this.recipientName)
                .replace(/\[Event Date\]/g, this.eventDate || '[Event Date]')
                .replace(/\[Event Time\]/g, this.eventTime || '[Event Time]')
                .replace(/\[Event Location\]/g, this.eventLocation || '[Event Location]')
            }
            ${this.ctaText && this.ctaUrl ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${this.ctaUrl}" class="cta-button">${this.ctaText}</a>
            </div>
            ` : ''}
        </div>
        <div class="footer">
            <p>${this.footerText.replace(/\[Company\]/g, this.companyName)}</p>
            ${footerLinks}
        </div>
    </div>
</body>
</html>`.trim();
    }

    private downloadHtml() {
        const blob = new Blob([this.generatedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.templateType}-email-template.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    private async copyHtml() {
        try {
            await navigator.clipboard.writeText(this.generatedHtml);
            this.isCopied = true;
            setTimeout(() => {
                this.isCopied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            this.isCopied = false;
        }
    }

    private previewEmail() {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(this.generatedHtml);
            newWindow.document.close();
        }
    }

    override firstUpdated() {
        this.updateSubjectAndContent();
        this.generateTemplate();
    }

    override render() {
        return html`
            <div class="container">
                <div class="settings-section">
                    <h3 class="section-title">Email Template Settings</h3>
                    
                    <div class="row">
                        <div class="input-group">
                            <label class="input-label">Template Type:</label>
                            <select class="form-input" @change="${this.handleTemplateChange}">
                                <option value="welcome" ?selected="${this.templateType === 'welcome'}">Welcome Email</option>
                                <option value="newsletter" ?selected="${this.templateType === 'newsletter'}">Newsletter</option>
                                <option value="promotional" ?selected="${this.templateType === 'promotional'}">Promotional</option>
                                <option value="notification" ?selected="${this.templateType === 'notification'}">Notification</option>
                                <option value="invitation" ?selected="${this.templateType === 'invitation'}">Invitation</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Company Name:</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                name="companyName"
                                .value="${this.companyName}"
                                @input="${this.handleInputChange}"
                            />
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-group">
                            <label class="input-label">Brand Color:</label>
                            <input 
                                type="color" 
                                class="form-input color-input" 
                                name="companyColor"
                                .value="${this.companyColor}"
                                @input="${this.handleInputChange}"
                            />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Recipient Name:</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                name="recipientName"
                                .value="${this.recipientName}"
                                @input="${this.handleInputChange}"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="input-label">Email Subject:</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            name="subject"
                            .value="${this.subject}"
                            @input="${this.handleInputChange}"
                        />
                    </div>

                    <div class="row">
                        <div class="input-group">
                            <label class="input-label">CTA Button Text:</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                name="ctaText"
                                .value="${this.ctaText}"
                                @input="${this.handleInputChange}"
                            />
                        </div>

                        <div class="input-group">
                            <label class="input-label">CTA Button URL:</label>
                            <input 
                                type="url" 
                                class="form-input" 
                                name="ctaUrl"
                                .value="${this.ctaUrl}"
                                @input="${this.handleInputChange}"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="input-label">Custom Content (HTML):</label>
                        <textarea 
                            class="form-input content-textarea" 
                            placeholder="Paste your HTML content here, or leave empty to use template default. Use [Company], [Name] as placeholders."
                            @input="${this.handleTextareaChange}"
                            .value="${this.customContent}"
                        ></textarea>
                        <small class="help-text">You can paste HTML directly here. Use &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;em&gt; tags as needed.</small>
                    </div>

                    ${this.templateType === 'invitation' ? html`
                        <div class="settings-group">
                            <h4 class="section-subtitle">Event Details</h4>
                            
                            <div class="row">
                                <div class="input-group">
                                    <label class="input-label">Event Date:</label>
                                    <input 
                                        type="text" 
                                        class="form-input" 
                                        name="eventDate"
                                        placeholder="e.g., Friday, March 15, 2024"
                                        .value="${this.eventDate}"
                                        @input="${this.handleInputChange}"
                                    />
                                </div>

                                <div class="input-group">
                                    <label class="input-label">Event Time:</label>
                                    <input 
                                        type="text" 
                                        class="form-input" 
                                        name="eventTime"
                                        placeholder="e.g., 6:00 PM - 9:00 PM"
                                        .value="${this.eventTime}"
                                        @input="${this.handleInputChange}"
                                    />
                                </div>
                            </div>

                            <div>
                                <label class="input-label">Event Location:</label>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    name="eventLocation"
                                    placeholder="e.g., Conference Center, 123 Main St"
                                    .value="${this.eventLocation}"
                                    @input="${this.handleInputChange}"
                                />
                            </div>
                        </div>
                    ` : ''}

                    <div>
                        <label class="input-label">Footer Text:</label>
                        <textarea 
                            class="form-input footer-textarea" 
                            name="footerText"
                            @input="${this.handleInputChange}"
                            .value="${this.footerText}"
                        ></textarea>
                    </div>

                    <!-- Footer Links Options -->
                    <div class="settings-group">
                        <h4 class="section-subtitle">Footer Links</h4>
                        
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    name="includeUnsubscribe"
                                    .checked="${this.includeUnsubscribe}"
                                    @change="${this.handleInputChange}"
                                />
                                Include Unsubscribe Link
                            </label>
                        </div>

                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    name="includePrivacyPolicy"
                                    .checked="${this.includePrivacyPolicy}"
                                    @change="${this.handleInputChange}"
                                />
                                Include Privacy Policy Link
                            </label>
                            ${this.includePrivacyPolicy ? html`
                                <input 
                                    type="url" 
                                    class="form-input url-input" 
                                    name="privacyPolicyUrl"
                                    placeholder="Privacy Policy URL"
                                    .value="${this.privacyPolicyUrl}"
                                    @input="${this.handleInputChange}"
                                />
                            ` : ''}
                        </div>

                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    name="includeTermsConditions"
                                    .checked="${this.includeTermsConditions}"
                                    @change="${this.handleInputChange}"
                                />
                                Include Terms & Conditions Link
                            </label>
                            ${this.includeTermsConditions ? html`
                                <input 
                                    type="url" 
                                    class="form-input url-input" 
                                    name="termsConditionsUrl"
                                    placeholder="Terms & Conditions URL"
                                    .value="${this.termsConditionsUrl}"
                                    @input="${this.handleInputChange}"
                                />
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="actions-section">
                    <button class="btn" @click="${this.previewEmail}">
                        Preview Email
                    </button>
                    <button class="btn" @click="${this.downloadHtml}">
                        Download HTML
                    </button>
                    <button class="btn btn-secondary" @click="${this.copyHtml}">
                        ${this.isCopied ? 'Copied🎉!' : 'Copy HTML'}
                    </button>
                </div>

                <div class="output-section">
                    <label class="input-label">Generated HTML:</label>
                    <textarea 
                        class="form-input html-output" 
                        readonly
                        .value="${this.generatedHtml}"
                    ></textarea>
                </div>

                <ul class="info">
                    <li>Generates responsive email templates compatible with major email clients</li>
                    <li>Company name is automatically updated in subject lines when changed</li>
                    <li>Customizable footer links for legal compliance (Privacy Policy, Terms & Conditions)</li>
                    <li>Templates are mobile-friendly with responsive design</li>
                    <li>Paste your HTML directly with proper tags</li>
                    <li>For invitation emails, fill in event details in the dedicated fields</li>
                    <li>Use [Company] and [Name] as placeholders in custom content</li>
                    <li>Test your emails across different clients before sending</li>
                </ul>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'email-template-generator': EmailTemplateGenerator;
    }
}