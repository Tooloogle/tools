import { html, TemplateResult } from 'lit';
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
} from './resume-builder-types.js';
import { ResumeBuilderIcons } from './resume-builder-icons.js';
import { ExperienceTemplate } from './resume-builder-experience-template.js';
import { EducationTemplate } from './resume-builder-education-template.js';
import { PersonalInfoTemplate } from './resume-builder-personal-template.js';
import { SkillTemplate } from './resume-builder-skills-template.js';

export interface TemplateHandlers {
  handlePersonalInfoChange: (update: {
    name: keyof PersonalInfo;
    value: string;
  }) => void;
  addExperience: () => void;
  updateExperience: (
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) => void;
  deleteExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  deleteEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: keyof Skill, value: string) => void;
  deleteSkill: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export class ResumeBuilderTemplates {
  private static navItems = [
    {
      id: 'personal',
      icon: ResumeBuilderIcons.getPersonalIcon(),
      label: 'Personal Info',
    },
    {
      id: 'experience',
      icon: ResumeBuilderIcons.getBriefcaseIcon(),
      label: 'Experience',
    },
    {
      id: 'education',
      icon: ResumeBuilderIcons.getGraduationIcon(),
      label: 'Education',
    },
    { id: 'skills', icon: ResumeBuilderIcons.getAwardIcon(), label: 'Skills' },
    { id: 'preview', icon: ResumeBuilderIcons.getEyeIcon(), label: 'Preview' },
  ];

  static renderNavigation(
    activeSection: string,
    setActiveSection: (section: string) => void
  ): TemplateResult {
    return html`
      <nav class="section-nav">
        ${this.renderNavItems(activeSection, setActiveSection)}
      </nav>
    `;
  }

  private static renderNavItems(
    activeSection: string,
    setActiveSection: (section: string) => void
  ): TemplateResult[] {
    return this.navItems.map(item =>
      this.renderNavItem(item, activeSection, setActiveSection)
    );
  }

  private static renderNavItem(
    item: { id: string; icon: TemplateResult; label: string },
    activeSection: string,
    setActiveSection: (section: string) => void
  ): TemplateResult {
    const handleNavClick = () => setActiveSection(item.id);

    return html`
      <button
        class="nav-item ${activeSection === item.id ? 'active' : ''}"
        @click="${handleNavClick}"
      >
        ${item.icon} ${item.label}
      </button>
    `;
  }

  static renderPersonalInfoSection(
    personalInfo: PersonalInfo,
    handlers: TemplateHandlers
  ): TemplateResult {
    return PersonalInfoTemplate.renderPersonalInfoSection(
      personalInfo,
      handlers
    );
  }

  static renderExperienceSection(
    experiences: Experience[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return ExperienceTemplate.renderExperienceSection(experiences, handlers);
  }

  static renderEducationSection(
    education: Education[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return EducationTemplate.renderEducationSection(education, handlers);
  }

  static renderSkillsSection(
    skills: Skill[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return SkillTemplate.renderSkillSection(skills, handlers);
  }
}
