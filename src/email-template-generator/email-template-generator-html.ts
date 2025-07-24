export interface EmailTemplateParams {
    subject: string;
    companyName: string;
    companyColor: string;
    content: string;
    ctaText: string;
    ctaUrl: string;
    footerText: string;
    footerLinks: string;
    recipientName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
}

export class EmailTemplateHtml {
    static generateTemplate(params: EmailTemplateParams): string {
        const processedContent = this.processContent(params.content, params);
        const ctaSection = this.generateCtaSection(
            params.ctaText,
            params.ctaUrl,
        );

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${params.subject}</title>
    <style>
        ${this.getEmailStyles(params.companyColor)}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${params.companyName}</h1>
        </div>
        <div class="content">
            ${processedContent}
            ${ctaSection}
        </div>
        <div class="footer">
            <p>${params.footerText.replace(
            /\[Company\]/g,
            params.companyName
        )}</p>
            ${params.footerLinks}
        </div>
    </div>
</body>
</html>`.trim();
    }

    private static processContent(
        content: string,
        params: EmailTemplateParams
    ): string {
        return content
            .replace(/\[Company\]/g, params.companyName)
            .replace(/\[Name\]/g, params.recipientName)
            .replace(/\[Event Date\]/g, params.eventDate || "[Event Date]")
            .replace(/\[Event Time\]/g, params.eventTime || "[Event Time]")
            .replace(
                /\[Event Location\]/g,
                params.eventLocation || "[Event Location]"
            );
    }

    private static generateCtaSection(
        ctaText: string,
        ctaUrl: string,
    ): string {
        if (!ctaText || !ctaUrl) {
            return "";
        }

        return `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${ctaUrl}" class="cta-button">${ctaText}</a>
            </div>
            `;
    }
    // eslint-disable-next-line max-lines-per-function
    private static getEmailStyles(companyColor: string): string {
        return `
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
            background-color: ${companyColor};
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
            color: ${companyColor};
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
            background-color: ${companyColor};
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
        }`;
    }
}
