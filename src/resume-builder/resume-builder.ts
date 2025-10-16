import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import resumeBuilderStyles from './resume-builder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { ResumeBuilderUtils } from './resume-builder-exports.js';
import {
  ResumeBuilderTemplates,
  TemplateHandlers,
} from './resume-builder-templates.js';
import { ResumeBuilderPreview } from './resume-builder-preview.js';
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
} from './resume-builder-types.js';

@customElement('resume-builder')
export class ResumeBuilder extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    resumeBuilderStyles,
  ];

  @property({ type: Object }) personalInfo: PersonalInfo = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    location: 'New York, NY',
    website: 'https://johndoe.com',
    summary:
      'Experienced professional with 5+ years in the industry. Skilled in various technologies and passionate about creating innovative solutions.',
  };

  @property({ type: Array }) experiences: Experience[] = [
    {
      id: ResumeBuilderUtils.generateId(),
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      location: 'New York, NY',
      startDate: '2020-01-01',
      endDate: '',
      current: true,
      description:
        'Lead a team of developers to create innovative software solutions. Improved system performance by 30%.',
    },
  ];

  @property({ type: Array }) education: Education[] = [
    {
      id: ResumeBuilderUtils.generateId(),
      institution: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: '2018-05-01',
      gpa: '3.8',
    },
  ];

  @property({ type: Array }) skills: Skill[] = [
    {
      id: ResumeBuilderUtils.generateId(),
      name: 'JavaScript',
      level: 'Expert',
    },
    {
      id: ResumeBuilderUtils.generateId(),
      name: 'TypeScript',
      level: 'Advanced',
    },
    { id: ResumeBuilderUtils.generateId(), name: 'HTML/CSS', level: 'Expert' },
  ];

  @property({ type: String }) activeSection = 'personal';
  @property({ type: String }) template = 'modern';

  private get templateHandlers(): TemplateHandlers {
    return {
      handlePersonalInfoChange: this.handlePersonalInfoChange.bind(this),
      addExperience: this.addExperience.bind(this),
      updateExperience: this.updateExperience.bind(this),
      deleteExperience: this.deleteExperience.bind(this),
      addEducation: this.addEducation.bind(this),
      updateEducation: this.updateEducation.bind(this),
      deleteEducation: this.deleteEducation.bind(this),
      addSkill: this.addSkill.bind(this),
      updateSkill: this.updateSkill.bind(this),
      deleteSkill: this.deleteSkill.bind(this),
      formatDate: ResumeBuilderUtils.formatDate,
    };
  }

  private handlePersonalInfoChange({
    name,
    value,
  }: {
    name: keyof PersonalInfo;
    value: string;
  }) {
    this.personalInfo = {
      ...this.personalInfo,
      [name]: value,
    };
    this.requestUpdate();
  }

  private addExperience() {
    this.experiences = [
      ...this.experiences,
      {
        id: ResumeBuilderUtils.generateId(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ];
  }

  private updateExperience(
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) {
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
        id: ResumeBuilderUtils.generateId(),
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
      },
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
        id: ResumeBuilderUtils.generateId(),
        name: '',
        level: 'Beginner',
      },
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

  private handleTemplateChange(template: string) {
    this.template = template;
  }

  private exportToHTML() {
    const resumePreview = this.shadowRoot?.querySelector(
      '.resume-preview'
    ) as HTMLElement;
    ResumeBuilderUtils.exportToHTML(this.personalInfo, resumePreview);
  }

  private exportToPDF() {
    const resumePreview = this.shadowRoot?.querySelector(
      '.resume-preview'
    ) as HTMLElement;
    ResumeBuilderUtils.exportToPDF(this.personalInfo, resumePreview);
  }

  private exportToWord() {
    const resumePreview = this.shadowRoot?.querySelector(
      '.resume-preview'
    ) as HTMLElement;
    ResumeBuilderUtils.exportToWord(this.personalInfo, resumePreview);
  }

  private renderActiveSection() {
    switch (this.activeSection) {
      case 'personal':
        return ResumeBuilderTemplates.renderPersonalInfoSection(
          this.personalInfo,
          this.templateHandlers
        );
      case 'experience':
        return ResumeBuilderTemplates.renderExperienceSection(
          this.experiences,
          this.templateHandlers
        );
      case 'education':
        return ResumeBuilderTemplates.renderEducationSection(
          this.education,
          this.templateHandlers
        );
      case 'skills':
        return ResumeBuilderTemplates.renderSkillsSection(
          this.skills,
          this.templateHandlers
        );
      case 'preview':
        return ResumeBuilderPreview.renderPreview(
          this.personalInfo,
          this.experiences,
          this.education,
          this.skills,
          this.template,
          this.handleTemplateChange.bind(this),
          this.exportToHTML.bind(this),
          this.exportToPDF.bind(this),
          this.exportToWord.bind(this)
        );
      default:
        return html`<div>Select a section to edit</div>`;
    }
  }

  override render() {
    return html`
      <div class="resume-builder">
        <div class="builder-content">
          <div class="builder-sidebar">
            ${ResumeBuilderTemplates.renderNavigation(
              this.activeSection,
              this.setActiveSection.bind(this)
            )}
          </div>
          <div class="builder-main">${this.renderActiveSection()}</div>
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
