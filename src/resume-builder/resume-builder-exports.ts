import { PersonalInfo } from "./resume-builder-types.js";

export class ResumeBuilderUtils {
    static generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    static formatDate(dateString: string): string {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    }

    static exportToHTML(
        personalInfo: PersonalInfo,
        resumePreview: HTMLElement | null
    ) {
        if (!resumePreview) return;

        const styles = this.getHTMLExportStyles();
        const htmlContent = this.buildHTMLContent(
            personalInfo,
            resumePreview,
            styles
        );
        this.downloadFile(
            htmlContent,
            `${personalInfo.fullName || "resume"}.html`,
            "text/html"
        );
    }

    static exportToPDF(
        personalInfo: PersonalInfo,
        resumePreview: HTMLElement | null
    ) {
        if (!resumePreview) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const styles = this.getPDFExportStyles();
        const content = this.buildPDFContent(personalInfo, resumePreview, styles);

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    static exportToWord(
        personalInfo: PersonalInfo,
        resumePreview: HTMLElement | null
    ) {
        if (!resumePreview) return;

        const wordContent = this.buildWordContent(personalInfo, resumePreview);
        const blob = new Blob(["\ufeff", wordContent], {
            type: "application/msword",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${personalInfo.fullName || "resume"}.doc`;
        a.click();
        URL.revokeObjectURL(url);
    }

    private static getHTMLExportStyles(): string {
        return `
            <style>
                body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
                .resume-preview { max-width: 8.5in; margin: 0 auto; padding:1rem }
                .preview-header-section { text-align: center; }
                .preview-header-section h1 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
                .contact-info { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; font-size: 0.875rem; }
                .contact-info span { display: flex; align-items: center; gap: 0.25rem; }
                .contact-info svg { width: 16px; height: 16px; }
                
                .preview-section h2 { font-size: 1.25rem; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
                .preview-section h2 svg { width: 20px; height: 20px; }
                .experience-entry, .education-entry { margin-bottom: 1rem; }
                .entry-header h3 { font-weight: 500; margin: 0 0 0.5rem 0; }
                .entry-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.875rem; color: #6b7280; }
                .entry-description { margin-top: 0.5rem; color: #374151; }
                .skills-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skill-tag { padding: 0.25rem 0.75rem; background: #f3f4f6; border-radius: 0.375rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; }
                .skill-name { font-weight: 500; }
                .skill-level { font-size: 0.75rem; color: #d6e3fd; }
                .company, .field { color: #6b7280; }

                /* Template-specific styles */
                .template-minimal { background: white; padding: 2rem; font-family: serif; }
                .template-minimal .preview-header-section h1 { color: black; border-bottom: 4px solid black; padding-bottom: 0.5rem; }
                .template-minimal .contact-info span { color: #1f2937; }
                .template-minimal .preview-section h2 { color: black; border-bottom: 2px solid black; text-transform: uppercase; letter-spacing: 0.05em; }
                .template-minimal .entry-header h3 { color: black; }
                .template-minimal .company, .template-minimal .field { font-style: italic; }
                .template-minimal .skill-tag { background: #f3f4f6; border: 1px solid #d1d5db; }

                .template-classic { background: white; padding: 2rem; }
                .template-classic .preview-header-section h1 { color: black; }
                .template-classic .contact-info span, .template-classic .preview-section h2 { color: black; }
                .template-classic .preview-section h2 { border-bottom: 2px solid black; }
                .template-classic .skill-tag { background: black; color: white; }

                .template-modern { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
                .template-modern .preview-header-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 0.75rem; }
                .template-modern .preview-header-section h1 { color: white; }
                .template-modern .contact-info span { color: rgba(255,255,255,0.9); }
                .template-modern .preview-section h2 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; border-bottom: 2px solid #6366f1; }
                .template-modern .company { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .template-modern .field { color: #6366f1; }
                .template-modern .skill-tag { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #f1f5f9; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3); }
                .template-modern .location, .template-modern .institution { color: #6366f1; font-weight: 500; }

                @media print {
                    body { margin: 0; }
                    .resume-preview { max-width: none; }
                }
            </style>
        `;
    }

    private static getPDFExportStyles(): string {
        return `
            <style>
                @page { 
                    size: A4; 
                    margin: 0.5in; 
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: system-ui, -apple-system, sans-serif; 
                    font-size: 12px;
                    line-height: 1.4;
                }
                .resume-preview { max-width: none; }
                .preview-header-section { text-align: center; margin-bottom: 1.5rem; }
                .preview-header-section h1 { font-size: 1.75rem; font-weight: bold; margin-bottom: 0.75rem; }
                .contact-info { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; font-size: 0.8rem; }
                .contact-info span { display: flex; align-items: center; gap: 0.25rem; }
                .contact-info svg { width: 14px; height: 14px; }
                .preview-section { margin-bottom: 1.25rem; page-break-inside: avoid; }
                .preview-section h2 { font-size: 1.1rem; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.25rem; }
                .preview-section h2 svg { width: 16px; height: 16px; }
                .experience-entry, .education-entry { margin-bottom: 0.75rem; page-break-inside: avoid; }
                .entry-header h3 { font-weight: 500; margin: 0 0 0.25rem 0; font-size: 1rem; }
                .entry-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.8rem; color: #6b7280; }
                .entry-description { margin-top: 0.25rem; color: #374151; font-size: 0.9rem; }
                .skills-preview { display: flex; flex-wrap: wrap; gap: 0.4rem; }
                .skill-tag { padding: 0.2rem 0.6rem; background: #f3f4f6; border-radius: 0.25rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem; }
                .skill-name { font-weight: 500; }
                .skill-level { font-size: 0.7rem; color: #6b7280; }
                .company, .field { color: #6b7280; }

                /* Template-specific print styles */
                .template-minimal { background: white !important; }
                .template-minimal .preview-header-section h1 { color: black; border-bottom: 2px solid black; padding-bottom: 0.25rem; }
                .template-minimal .preview-section h2 { color: black; border-bottom: 1px solid black; text-transform: uppercase; letter-spacing: 0.05em; }
                .template-minimal .skill-tag { background: #f9f9f9; border: 1px solid #ddd; }

                .template-classic { background: white !important; }
                .template-classic .preview-header-section h1, .template-classic .preview-section h2 { color: black; }
                .template-classic .preview-section h2 { border-bottom: 1px solid black; }
                .template-classic .skill-tag { background: black; color: white; }

                .template-modern { background: white !important; }
                .template-modern .preview-header-section { background: #6366f1 !important; color: white; padding: 1.5rem; border-radius: 0.5rem; }
                .template-modern .preview-section h2 { color: #6366f1; border-bottom: 1px solid #6366f1; }
                .template-modern .company, .template-modern .field { color: #6366f1; }
                .template-modern .skill-tag { background: #6366f1; color: white; }
            </style>
        `;
    }

    private static buildHTMLContent(
        personalInfo: PersonalInfo,
        resumePreview: HTMLElement,
        styles: string
    ): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${personalInfo.fullName || "Resume"}</title>
                ${styles}
            </head>
            <body>
                ${resumePreview.outerHTML}
            </body>
            </html>
        `;
    }

    private static buildPDFContent(
        personalInfo: PersonalInfo,
        resumePreview: HTMLElement,
        styles: string
    ): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${personalInfo.fullName || "Resume"}</title>
                ${styles}
            </head>
            <body>
                ${resumePreview.outerHTML}
            </body>
            </html>
        `;
    }

    private static buildWordContent(
        personalInfo: PersonalInfo,
        resumePreview: HTMLElement
    ): string {
        return `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <title>${personalInfo.fullName || "Resume"}</title>
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>90</w:Zoom>
                        <w:DoNotPromptForConvert/>
                        <w:DoNotShowInsertionsAndDeletions/>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    body { 
                        font-family: 'Times New Roman', serif; 
                        font-size: 12pt; 
                        line-height: 1.4; 
                        margin: 1in;
                    }
                    .resume-preview { max-width: none; }
                    .preview-header-section { text-align: center; margin-bottom: 20pt; }
                    .preview-header-section h1 { font-size: 18pt; font-weight: bold; margin-bottom: 10pt; }
                    .contact-info { text-align: center; margin-bottom: 15pt; }
                    .contact-info span { margin: 0 10pt; }
                    .preview-section { margin-bottom: 15pt; }
                    .preview-section h2 { font-size: 14pt; font-weight: bold; border-bottom: 1pt solid black; margin-bottom: 8pt; }
                    .experience-entry, .education-entry { margin-bottom: 10pt; }
                    .entry-header h3 { font-weight: bold; margin-bottom: 3pt; }
                    .entry-meta { margin-bottom: 5pt; color: #666; }
                    .entry-description { margin-bottom: 8pt; }
                    .skills-preview span { margin-right: 15pt; }
                    .skill-tag { display: inline-block; margin-right: 10pt; margin-bottom: 5pt; }
                    
                    /* Remove SVG icons for Word compatibility */
                    svg { display: none; }
                </style>
            </head>
            <body>
                ${resumePreview.innerHTML}
            </body>
            </html>
        `;
    }

    private static downloadFile(
        content: string,
        filename: string,
        mimeType: string
    ) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}
