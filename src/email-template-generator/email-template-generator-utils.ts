export interface TemplateData {
    welcome: {
        subject: string;
        content: string;
    };
    newsletter: {
        subject: string;
        content: string;
    };
    promotional: {
        subject: string;
        content: string;
    };
    notification: {
        subject: string;
        content: string;
    };
    invitation: {
        subject: string;
        content: string;
    };
}
export class EmailTemplateUtils {
    // eslint-disable-next-line max-lines-per-function
    static getTemplates(
        companyName: string,
        recipientName: string,
        eventDate: string,
        eventTime: string,
        eventLocation: string
    ): TemplateData {
        return {
            welcome: {
                subject: `Welcome to ${companyName}!`,
                content: `
                    <h2>Welcome to ${companyName}!</h2>
                    <p>Hi ${recipientName},</p>
                    <p>Thank you for joining ${companyName}. We're excited to have you on board!</p>
                    <p>Here's what you can do next:</p>
                    <ul>
                        <li>Complete your profile setup</li>
                        <li>Explore our features</li>
                        <li>Join our community</li>
                    </ul>
                `,
            },
            newsletter: {
                subject: `${companyName} Newsletter - [Month] Edition`,
                content: `
                    <h2>Monthly Newsletter</h2>
                    <p>Hi ${recipientName},</p>
                    <p>Here are the latest updates from ${companyName}:</p>
                    <h3>📰 What's New</h3>
                    <p>We've been busy working on exciting new features and improvements.</p>
                    <h3>🎯 Featured Content</h3>
                    <p>Check out our latest blog posts and resources.</p>
                `,
            },
            promotional: {
                subject: `Special Offer from ${companyName} - Just for You!`,
                content: `
                    <h2>🎉 Limited Time Offer!</h2>
                    <p>Hi ${recipientName},</p>
                    <p>We have an exclusive offer just for you from ${companyName}.</p>
                    <p><strong>Get 50% off your next purchase!</strong></p>
                    <p>This offer expires soon, so don't miss out.</p>
                `,
            },
            notification: {
                subject: `Important Update from ${companyName}`,
                content: `
                    <h2>Important Notification</h2>
                    <p>Hi ${recipientName},</p>
                    <p>We wanted to inform you about an important update regarding your ${companyName} account.</p>
                    <p>Please take a moment to review this information.</p>
                `,
            },
            invitation: {
                subject: `You're Invited! Join ${companyName} for ${eventDate || "[Event]"
                    }`,
                content: `
                    <h2>🎊 You're Invited!</h2>
                    <p>Hi ${recipientName},</p>
                    <p>${companyName} is hosting a special event and we'd love for you to join us!</p>
                    <p><strong>Event Details:</strong></p>
                    <ul>
                        <li>Date: ${eventDate || "[Event Date]"}</li>
                        <li>Time: ${eventTime || "[Event Time]"}</li>
                        <li>Location: ${eventLocation || "[Event Location]"
                    }</li>
                    </ul>
                `,
            },
        };
    }

    static generateFooterLinks(
        includeUnsubscribe: boolean,
        includePrivacyPolicy: boolean,
        includeTermsConditions: boolean,
        privacyPolicyUrl: string,
        termsConditionsUrl: string
    ): string {
        const footerLinks = [];

        if (includeUnsubscribe) {
            footerLinks.push(
                '<a href="[UNSUBSCRIBE_URL]" style="color: #6c757d;">Unsubscribe</a>'
            );
        }

        if (includePrivacyPolicy) {
            footerLinks.push(
                `<a href="${privacyPolicyUrl}" style="color: #6c757d;">Privacy Policy</a>`
            );
        }

        if (includeTermsConditions) {
            footerLinks.push(
                `<a href="${termsConditionsUrl}" style="color: #6c757d;">Terms &amp; Conditions</a>`
            );
        }

        return footerLinks.length > 0 ? `<p>${footerLinks.join(" | ")}</p>` : "";
    }

    static downloadHtml(content: string, templateType: string): void {
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${templateType}-email-template.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async copyToClipboard(content: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (err) {
            console.error("Failed to copy:", err);
            return false;
        }
    }

    static previewEmail(content: string): void {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(content);
            newWindow.document.close();
        }
    }
}
