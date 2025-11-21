import { html, TemplateResult } from 'lit';
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
} from './resume-builder-types.js';
import { ResumeBuilderUtils } from './resume-builder-exports.js';
import { ResumeBuilderIcons } from './resume-builder-icons.js';

/* eslint-disable max-lines */
export class ResumeBuilderPreview {
  /* eslint-disable max-lines-per-function */
  static renderPreview(
    personalInfo: PersonalInfo,
    experiences: Experience[],
    education: Education[],
    skills: Skill[],
    template: string,
    onTemplateChange: (template: string) => void,
    onExportHTML: () => void,
    onExportPDF: () => void,
    onExportWord: () => void
  ): TemplateResult {
    const hasPersonalInfo = this.hasPersonalInfoData(personalInfo);
    const hasExperience = experiences.length > 0;
    const hasEducation = education.length > 0;
    const hasSkills = skills.length > 0;

    return html`
      <div class="preview-container">
        <div class="preview-header">
          <h3>Resume Preview</h3>
          <div class="template-selector">
            <label>Template:</label>
            <select
              .value="${template}"
              @change="${this.handleTemplateChange(onTemplateChange)}"
            >
              <option value="minimal">Minimal</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
          </div>
        </div>
        <div class="preview-template">
          ${this.renderPreviewContent(
            personalInfo,
            experiences,
            education,
            skills,
            template,
            hasPersonalInfo,
            hasExperience,
            hasEducation,
            hasSkills
          )}
        </div>
        <div class="export-buttons">
          <button class="btn btn-primary" @click="${onExportPDF}">
            Export PDF
          </button>
          <button class="btn btn-primary" @click="${onExportHTML}">
            Export HTML
          </button>
          <button class="btn btn-primary" @click="${onExportWord}">
            Export Word
          </button>
        </div>
      </div>
    `;
  }

  private static handleTemplateChange(
    onTemplateChange: (value: string) => void
  ) {
    return (e: Event) => {
      onTemplateChange((e.target as HTMLSelectElement).value);
    };
  }

  private static hasPersonalInfoData(personalInfo: PersonalInfo): boolean {
    return Boolean(
      personalInfo.fullName ||
        personalInfo.email ||
        personalInfo.phone ||
        personalInfo.location ||
        personalInfo.website ||
        personalInfo.summary
    );
  }

  private static renderPreviewContent(
    personalInfo: PersonalInfo,
    experiences: Experience[],
    education: Education[],
    skills: Skill[],
    template: string,
    hasPersonalInfo: boolean,
    hasExperience: boolean,
    hasEducation: boolean,
    hasSkills: boolean
  ): TemplateResult {
    if (!hasPersonalInfo && !hasExperience && !hasEducation && !hasSkills) {
      return this.renderEmptyPreview();
    }

    return html`
      <div class="resume-preview template-${template}">
        ${this.renderHeaderSection(personalInfo, template)}
        ${this.renderSummarySection(personalInfo, template)}
        ${hasExperience
          ? this.renderExperienceSection(experiences, template)
          : ''}
        ${hasEducation ? this.renderEducationSection(education, template) : ''}
        ${hasSkills ? this.renderSkillsSection(skills, template) : ''}
      </div>
    `;
  }

  private static renderEmptyPreview(): TemplateResult {
    return html`
      <div class="empty-preview">
        <h3>Your Resume Preview Will Appear Here</h3>
        <p>
          Start by filling out your personal information, experience, education,
          and skills.
        </p>
      </div>
    `;
  }

  private static renderHeaderSection(
    personalInfo: PersonalInfo,
    template: string
  ): TemplateResult {
    return html`
      <div class="preview-header-section">
        <h1>${personalInfo.fullName || 'Your Name'}</h1>
        <div class="contact-info">
          ${this.renderContactInfo(personalInfo, template)}
        </div>
      </div>
    `;
  }

  private static renderContactInfo(
    personalInfo: PersonalInfo,
    template: string
  ): TemplateResult[] {
    const contactItems = [];

    if (personalInfo.email) {
      contactItems.push(html`
        <span>
          ${this.renderIcon(template, ResumeBuilderIcons.getMailIcon())}
          ${personalInfo.email}
        </span>
      `);
    }

    if (personalInfo.phone) {
      contactItems.push(html`
        <span>
          ${this.renderIcon(template, ResumeBuilderIcons.getPhoneIcon())}
          ${personalInfo.phone}
        </span>
      `);
    }

    if (personalInfo.location) {
      contactItems.push(html`
        <span>
          ${this.renderIcon(template, ResumeBuilderIcons.getLocationIcon())}
          ${personalInfo.location}
        </span>
      `);
    }

    if (personalInfo.website) {
      contactItems.push(html`
        <span>
          ${this.renderIcon(template, ResumeBuilderIcons.getGlobeIcon())}
          ${personalInfo.website}
        </span>
      `);
    }

    return contactItems;
  }

  private static renderSummarySection(
    personalInfo: PersonalInfo,
    template: string
  ): TemplateResult {
    if (!personalInfo.summary) {
        return html``;
    }

    return html`
      <div class="preview-section">
        ${this.renderSectionHeader(
          template,
          ResumeBuilderIcons.getUserIcon(),
          'Summary'
        )}
        <p>${personalInfo.summary}</p>
      </div>
    `;
  }

  private static renderExperienceSection(
    experiences: Experience[],
    template: string
  ): TemplateResult {
    const experienceEntries = experiences.map(
      exp => html`
        <div class="experience-entry">
          <div class="entry-header">
            <h3>
              ${exp.position || 'Your Position'}
              <span class="company"
                >${exp.company ? `@ ${exp.company}` : ''}</span
              >
            </h3>
            <div class="entry-meta">
              ${exp.location
                ? html`<span class="location">${exp.location}</span>`
                : ''}
              <span class="date">
                ${exp.startDate
                  ? ResumeBuilderUtils.formatDate(exp.startDate)
                  : 'Start Date'}
                -
                ${exp.current
                  ? 'Present'
                  : exp.endDate
                  ? ResumeBuilderUtils.formatDate(exp.endDate)
                  : 'End Date'}
              </span>
            </div>
          </div>
          ${exp.description
            ? html`<div class="entry-description">${exp.description}</div>`
            : ''}
        </div>
      `
    );

    return html`
      <div class="preview-section">
        ${this.renderSectionHeader(
          template,
          ResumeBuilderIcons.getBriefcaseIcon(),
          'Work Experience'
        )}
        ${experienceEntries}
      </div>
    `;
  }

  private static renderEducationSection(
    education: Education[],
    template: string
  ): TemplateResult {
    const educationEntries = education.map(
      edu => html`
        <div class="education-entry">
          <div class="entry-header">
            <h3>
              ${edu.degree || 'Your Degree'}
              <span class="field">${edu.field ? `in ${edu.field}` : ''}</span>
            </h3>
            <div class="entry-meta">
              <span class="institution"
                >${edu.institution || 'Institution Name'}</span
              >
              <span class="date">
                ${edu.graduationDate
                  ? ResumeBuilderUtils.formatDate(edu.graduationDate)
                  : 'Graduation Date'}
                ${edu.gpa
                  ? html`<span class="gpa">• GPA: ${edu.gpa}</span>`
                  : ''}
              </span>
            </div>
          </div>
        </div>
      `
    );

    return html`
      <div class="preview-section">
        ${this.renderSectionHeader(
          template,
          ResumeBuilderIcons.getGraduationIcon(),
          'Education'
        )}
        ${educationEntries}
      </div>
    `;
  }

  private static renderSkillsSection(
    skills: Skill[],
    template: string
  ): TemplateResult {
    const skillTags = skills.map(
      skill => html`
        <div class="skill-tag">
          <span class="skill-name">${skill.name || 'Skill'}</span>
          ${skill.level
            ? html`<span class="skill-level">(${skill.level})</span>`
            : ''}
        </div>
      `
    );

    return html`
      <div class="preview-section">
        ${this.renderSectionHeader(
          template,
          ResumeBuilderIcons.getAwardIcon(),
          'Skills'
        )}
        <div class="skills-preview">${skillTags}</div>
      </div>
    `;
  }

  private static renderIcon(
    template: string,
    iconTemplate: TemplateResult
  ): TemplateResult | string {
    return template === 'minimal' ? '' : iconTemplate;
  }

  private static renderSectionHeader(
    template: string,
    icon: TemplateResult,
    title: string
  ): TemplateResult {
    if (template === 'minimal') {
      return html`<h2>${title}</h2>`;
    }

    return html`<h2>${icon} ${title}</h2>`;
  }
}
