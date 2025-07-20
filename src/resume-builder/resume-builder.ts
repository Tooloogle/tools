import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import resumeBuilderStyles from './resume-builder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
}

interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa: string;
}

interface Skill {
    id: string;
    name: string;
    level: string;
}

@customElement('resume-builder')
export class ResumeBuilder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, resumeBuilderStyles];
    
    @property({ type: Object }) personalInfo: PersonalInfo = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        location: 'New York, NY',
        website: 'https://johndoe.com',
        summary: 'Experienced professional with 5+ years in the industry. Skilled in various technologies and passionate about creating innovative solutions.'
    };

    @property({ type: Array }) experiences: Experience[] = [{
        id: this.generateId(),
        company: 'Tech Solutions Inc.',
        position: 'Senior Developer',
        location: 'New York, NY',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Lead a team of developers to create innovative software solutions. Improved system performance by 30%.'
    }];

    @property({ type: Array }) education: Education[] = [{
        id: this.generateId(),
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2018-05-01',
        gpa: '3.8'
    }];

    @property({ type: Array }) skills: Skill[] = [
        { id: this.generateId(), name: 'JavaScript', level: 'Expert' },
        { id: this.generateId(), name: 'TypeScript', level: 'Advanced' },
        { id: this.generateId(), name: 'HTML/CSS', level: 'Expert' }
    ];

    @property({ type: String }) activeSection = 'personal';
    @property({ type: String }) template = 'modern';

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private handlePersonalInfoChange(e: Event) {
        const input = e.target as HTMLInputElement | HTMLTextAreaElement;
        const field = input.name as keyof PersonalInfo;
        this.personalInfo = {
            ...this.personalInfo,
            [field]: input.value
        };
    }

    private addExperience() {
        this.experiences = [
            ...this.experiences,
            {
                id: this.generateId(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }
        ];
    }

    private updateExperience(id: string, field: keyof Experience, value: string | boolean) {
        this.experiences = this.experiences.map(exp => 
            exp.id === id ? { ...exp, [field]: value } : exp
        );
    }

    private deleteExperience(id: string) {
        this.experiences = this.experiences.filter(exp => exp.id !== id);
    }

    private addEducation() {
        this.education = [
            ...this.education,
            {
                id: this.generateId(),
                institution: '',
                degree: '',
                field: '',
                graduationDate: '',
                gpa: ''
            }
        ];
    }

    private updateEducation(id: string, field: keyof Education, value: string) {
        this.education = this.education.map(edu => 
            edu.id === id ? { ...edu, [field]: value } : edu
        );
    }

    private deleteEducation(id: string) {
        this.education = this.education.filter(edu => edu.id !== id);
    }

    private addSkill() {
        this.skills = [
            ...this.skills,
            {
                id: this.generateId(),
                name: '',
                level: 'Beginner'
            }
        ];
    }

    private updateSkill(id: string, field: keyof Skill, value: string) {
        this.skills = this.skills.map(skill => 
            skill.id === id ? { ...skill, [field]: value } : skill
        );
    }

    private deleteSkill(id: string) {
        this.skills = this.skills.filter(skill => skill.id !== id);
    }

    private setActiveSection(section: string) {
        this.activeSection = section;
    }

    // Add these methods to your ResumeBuilder class

private exportToHTML() {
    const resumePreview = this.shadowRoot?.querySelector('.resume-preview') as HTMLElement;
    if (!resumePreview) return;

    // Get the computed styles
    const styles = `
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
            .skill-level { font-size: 0.75rem; color: #6b7280; }
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

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this.personalInfo.fullName || 'Resume'}</title>
            ${styles}
        </head>
        <body>
            ${resumePreview.outerHTML}
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.personalInfo.fullName || 'resume'}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

private exportToPDF() {
    const resumePreview = this.shadowRoot?.querySelector('.resume-preview') as HTMLElement;
    if (!resumePreview) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
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

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${this.personalInfo.fullName || 'Resume'}</title>
            ${styles}
        </head>
        <body>
            ${resumePreview.outerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

private exportToWord() {
    const resumePreview = this.shadowRoot?.querySelector('.resume-preview') as HTMLElement;
    if (!resumePreview) return;

    // Create a simple Word-compatible HTML structure
    const wordContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>${this.personalInfo.fullName || 'Resume'}</title>
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

    const blob = new Blob(['\ufeff', wordContent], { 
        type: 'application/msword' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.personalInfo.fullName || 'resume'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
}

    private formatDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    private renderPersonalInfoSection() {
        return html`
            <div class="section personal-info">
                <h3>Personal Information</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            .value="${this.personalInfo.fullName}"
                            @input="${this.handlePersonalInfoChange}"
                            placeholder="John Doe"
                        />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            .value="${this.personalInfo.email}"
                            @input="${this.handlePersonalInfoChange}"
                            placeholder="john.doe@email.com"
                        />
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            .value="${this.personalInfo.phone}"
                            @input="${this.handlePersonalInfoChange}"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            .value="${this.personalInfo.location}"
                            @input="${this.handlePersonalInfoChange}"
                            placeholder="City, State"
                        />
                    </div>
                    <div class="form-group">
                        <label for="website">Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            .value="${this.personalInfo.website}"
                            @input="${this.handlePersonalInfoChange}"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                    <div class="form-group full-width">
                        <label for="summary">Professional Summary</label>
                        <textarea
                            id="summary"
                            name="summary"
                            .value="${this.personalInfo.summary}"
                            @input="${this.handlePersonalInfoChange}"
                            placeholder="Brief professional summary..."
                            rows="4"
                        ></textarea>
                    </div>
                </div>
            </div>
        `;
    }

    private renderExperienceSection() {
        return html`
            <div class="section experience">
                <div class="section-header">
                    <h3>Work Experience</h3>
                    <button class="btn btn-primary" @click="${this.addExperience}">
                        Add Experience
                    </button>
                </div>
                ${this.experiences.map(exp => html`
                    <div class="experience-item" key="${exp.id}">
                        <div class="item-header">
                            <h4>Experience Entry</h4>
                            <button class="btn btn-danger" @click="${() => this.deleteExperience(exp.id)}">
                                Delete
                            </button>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Company</label>
                                <input
                                    type="text"
                                    .value="${exp.company}"
                                    @input="${(e: Event) => this.updateExperience(exp.id, 'company', (e.target as HTMLInputElement).value)}"
                                    placeholder="Company Name"
                                />
                            </div>
                            <div class="form-group">
                                <label>Position</label>
                                <input
                                    type="text"
                                    .value="${exp.position}"
                                    @input="${(e: Event) => this.updateExperience(exp.id, 'position', (e.target as HTMLInputElement).value)}"
                                    placeholder="Job Title"
                                />
                            </div>
                            <div class="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    .value="${exp.location}"
                                    @input="${(e: Event) => this.updateExperience(exp.id, 'location', (e.target as HTMLInputElement).value)}"
                                    placeholder="City, State"
                                />
                            </div>
                            <div class="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    .value="${exp.startDate}"
                                    @input="${(e: Event) => this.updateExperience(exp.id, 'startDate', (e.target as HTMLInputElement).value)}"
                                />
                            </div>
                            <div class="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    .value="${exp.endDate}"
                                    .disabled="${exp.current}"
                                    @input="${(e: Event) => this.updateExperience(exp.id, 'endDate', (e.target as HTMLInputElement).value)}"
                                />
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        .checked="${exp.current}"
                                        @change="${(e: Event) => this.updateExperience(exp.id, 'current', (e.target as HTMLInputElement).checked)}"
                                    />
                                    Current Position
                                </label>
                            </div>
                            <div class="form-group full-width">
                                <label>Job Description</label>
                                <textarea
                                    .value="${exp.description}"
                                    @input="${(e: Event) => this.updateExperience(exp.id, 'description', (e.target as HTMLTextAreaElement).value)}"
                                    placeholder="Describe your responsibilities and achievements..."
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    private renderEducationSection() {
        return html`
            <div class="section education">
                <div class="section-header">
                    <h3>Education</h3>
                    <button class="btn btn-primary" @click="${this.addEducation}">
                        Add Education
                    </button>
                </div>
                ${this.education.map(edu => html`
                    <div class="education-item" key="${edu.id}">
                        <div class="item-header">
                            <h4>Education Entry</h4>
                            <button class="btn btn-danger" @click="${() => this.deleteEducation(edu.id)}">
                                Delete
                            </button>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Institution</label>
                                <input
                                    type="text"
                                    .value="${edu.institution}"
                                    @input="${(e: Event) => this.updateEducation(edu.id, 'institution', (e.target as HTMLInputElement).value)}"
                                    placeholder="University Name"
                                />
                            </div>
                            <div class="form-group">
                                <label>Degree</label>
                                <input
                                    type="text"
                                    .value="${edu.degree}"
                                    @input="${(e: Event) => this.updateEducation(edu.id, 'degree', (e.target as HTMLInputElement).value)}"
                                    placeholder="Bachelor's, Master's, etc."
                                />
                            </div>
                            <div class="form-group">
                                <label>Field of Study</label>
                                <input
                                    type="text"
                                    .value="${edu.field}"
                                    @input="${(e: Event) => this.updateEducation(edu.id, 'field', (e.target as HTMLInputElement).value)}"
                                    placeholder="Computer Science, Business, etc."
                                />
                            </div>
                            <div class="form-group">
                                <label>Graduation Date</label>
                                <input
                                    type="date"
                                    .value="${edu.graduationDate}"
                                    @input="${(e: Event) => this.updateEducation(edu.id, 'graduationDate', (e.target as HTMLInputElement).value)}"
                                />
                            </div>
                            <div class="form-group">
                                <label>GPA (Optional)</label>
                                <input
                                    type="text"
                                    .value="${edu.gpa}"
                                    @input="${(e: Event) => this.updateEducation(edu.id, 'gpa', (e.target as HTMLInputElement).value)}"
                                    placeholder="3.8/4.0"
                                />
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    private renderSkillsSection() {
        return html`
            <div class="section skills">
                <div class="section-header">
                    <h3>Skills</h3>
                    <button class="btn btn-primary" @click="${this.addSkill}">
                        Add Skill
                    </button>
                </div>
                <div class="skills-grid">
                    ${this.skills.map(skill => html`
                        <div class="skill-item" key="${skill.id}">
                            <div class="form-group">
                                <input
                                    type="text"
                                    .value="${skill.name}"
                                    @input="${(e: Event) => this.updateSkill(skill.id, 'name', (e.target as HTMLInputElement).value)}"
                                    placeholder="Skill name"
                                />
                            </div>
                            <div class="form-group">
                                <select
                                    .value="${skill.level}"
                                    @change="${(e: Event) => this.updateSkill(skill.id, 'level', (e.target as HTMLSelectElement).value)}"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <button class="btn btn-danger btn-sm" @click="${() => this.deleteSkill(skill.id)}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    private renderPreview() {
    const hasPersonalInfo = this.personalInfo.fullName || this.personalInfo.email || 
                          this.personalInfo.phone || this.personalInfo.location || 
                          this.personalInfo.website || this.personalInfo.summary;
    
    const hasExperience = this.experiences.length > 0;
    const hasEducation = this.education.length > 0;
    const hasSkills = this.skills.length > 0;

    // Helper function to render icons based on template
    const renderIcon = (iconSvg: any) => {
        if (this.template === 'minimal') return '';
        return iconSvg;
    };

    // Helper function to get section header with conditional icons
    const renderSectionHeader = (iconSvg: any, title: string) => {
        if (this.template === 'minimal') {
            return html`<h2>${title}</h2>`;
        }
        return html`<h2>${iconSvg} ${title}</h2>`;
    };

    return html`
        <div class="preview-container">
            <div class="preview-header">
                <h3>Resume Preview</h3>
                <div class="template-selector">
                    <label>Template:</label>
                    <select .value="${this.template}" @change="${(e: Event) => this.template = (e.target as HTMLSelectElement).value}">
                        <option value="minimal">Minimal</option>
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                    </select>
                </div>
            </div>
            
            ${hasPersonalInfo || hasExperience || hasEducation || hasSkills ? html`
                <div class="resume-preview template-${this.template}">
                    <div class="preview-header-section">
                        <h1>${this.personalInfo.fullName || 'Your Name'}</h1>
                        <div class="contact-info">
                            ${this.personalInfo.email ? html`
                                <span>
                                    ${renderIcon(html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`)}
                                    ${this.personalInfo.email}
                                </span>
                            ` : ''}
                            ${this.personalInfo.phone ? html`
                                <span>
                                    ${renderIcon(html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`)}
                                    ${this.personalInfo.phone}
                                </span>
                            ` : ''}
                            ${this.personalInfo.location ? html`
                                <span>
                                    ${renderIcon(html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`)}
                                    ${this.personalInfo.location}
                                </span>
                            ` : ''}
                            ${this.personalInfo.website ? html`
                                <span>
                                    ${renderIcon(html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`)}
                                    ${this.personalInfo.website}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${this.personalInfo.summary ? html`
                        <div class="preview-section">
                            ${renderSectionHeader(
                                html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
                                'Summary'
                            )}
                            <p>${this.personalInfo.summary}</p>
                        </div>
                    ` : ''}

                    ${hasExperience ? html`
                        <div class="preview-section">
                            ${renderSectionHeader(
                                html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
                                'Work Experience'
                            )}
                            ${this.experiences.map(exp => html`
                                <div class="experience-entry">
                                    <div class="entry-header">
                                        <h3>${exp.position || 'Your Position'} <span class="company">${exp.company ? '@ ' + exp.company : ''}</span></h3>
                                        <div class="entry-meta">
                                            ${exp.location ? html`<span class="location">${exp.location}</span>` : ''}
                                            <span class="date">
                                                ${exp.startDate ? this.formatDate(exp.startDate) : 'Start Date'} - 
                                                ${exp.current ? 'Present' : (exp.endDate ? this.formatDate(exp.endDate) : 'End Date')}
                                            </span>
                                        </div>
                                    </div>
                                    ${exp.description ? html`<div class="entry-description">${exp.description}</div>` : ''}
                                </div>
                            `)}
                        </div>
                    ` : ''}

                    ${hasEducation ? html`
                        <div class="preview-section">
                            ${renderSectionHeader(
                                html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 6 0 0 0 12 0v-3.5"/></svg>`,
                                'Education'
                            )}
                            ${this.education.map(edu => html`
                                <div class="education-entry">
                                    <div class="entry-header">
                                        <h3>${edu.degree || 'Your Degree'} <span class="field">${edu.field ? 'in ' + edu.field : ''}</span></h3>
                                        <div class="entry-meta">
                                            <span class="institution">${edu.institution || 'Institution Name'}</span>
                                            <span class="date">
                                                ${edu.graduationDate ? this.formatDate(edu.graduationDate) : 'Graduation Date'}
                                                ${edu.gpa ? html`<span class="gpa">• GPA: ${edu.gpa}</span>` : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    ` : ''}

                    ${hasSkills ? html`
                        <div class="preview-section">
                            ${renderSectionHeader(
                                html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
                                'Skills'
                            )}
                            <div class="skills-preview">
                                ${this.skills.map(skill => html`
                                    <div class="skill-tag">
                                        <span class="skill-name">${skill.name || 'Skill'}</span>
                                        ${skill.level ? html`<span class="skill-level">(${skill.level})</span>` : ''}
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            ` : html`
                <div class="empty-preview">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-search"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3"/><polyline points="14 2 14 8 20 8"/><path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="m9 18-1.5-1.5"/></svg>
                    <h3>Your Resume Preview Will Appear Here</h3>
                    <p>Start by filling out your personal information, experience, education, and skills.</p>
                </div>
            `}
            <div class="export-buttons">
                    <button class="btn btn-primary" @click="${this.exportToPDF}">Export PDF</button>
                    <button class="btn btn-primary" @click="${this.exportToHTML}">Export HTML</button>
                    <button class="btn btn-primary" @click="${this.exportToWord}">Export Word</button>
            </div>
        </div>
    `;
}

    override render() {
        return html`
            <div class="resume-builder">
                <div class="builder-header">
                    <h1>Resume Builder</h1>
                </div>
                
                <div class="builder-content">
                    <div class="builder-sidebar">
                        <nav class="section-nav">
                            <button 
                                class="nav-item ${this.activeSection === 'personal' ? 'active' : ''}"
                                @click="${() => this.setActiveSection('personal')}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Personal Info
                            </button>
                            <button 
                                class="nav-item ${this.activeSection === 'experience' ? 'active' : ''}"
                                @click="${() => this.setActiveSection('experience')}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                                Experience
                            </button>
                            <button 
                                class="nav-item ${this.activeSection === 'education' ? 'active' : ''}"
                                @click="${() => this.setActiveSection('education')}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 6 0 0 0 12 0v-3.5"/></svg>
                                Education
                            </button>
                            <button 
                                class="nav-item ${this.activeSection === 'skills' ? 'active' : ''}"
                                @click="${() => this.setActiveSection('skills')}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                                Skills
                            </button>
                            <button 
                                class="nav-item ${this.activeSection === 'preview' ? 'active' : ''}"
                                @click="${() => this.setActiveSection('preview')}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                Preview
                            </button>
                        </nav>
                    </div>

                    <div class="builder-main">
                        ${this.activeSection === 'personal' ? this.renderPersonalInfoSection() : ''}
                        ${this.activeSection === 'experience' ? this.renderExperienceSection() : ''}
                        ${this.activeSection === 'education' ? this.renderEducationSection() : ''}
                        ${this.activeSection === 'skills' ? this.renderSkillsSection() : ''}
                        ${this.activeSection === 'preview' ? this.renderPreview() : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'resume-builder': ResumeBuilder;
    }
}