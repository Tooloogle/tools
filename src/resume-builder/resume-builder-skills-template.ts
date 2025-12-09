import { html, TemplateResult } from 'lit';
import { Skill } from './resume-builder-types.js';
import { TemplateHandlers } from './resume-builder-templates.js';
import { ResumeBuilderIcons } from './resume-builder-icons.js';
import '../t-button';

export class SkillTemplate {
  static renderSkillSection(
    skills: Skill[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return html`
      <div class="section skills">
        <div class="section-header">
          <h3>Skills</h3>
          <t-button variant="blue" @click="${handlers.addSkill}">
            Add Skill
          </t-button>
        </div>
        <div class="skills-grid">
          ${this.renderSkillItems(skills, handlers)}
        </div>
      </div>
    `;
  }

  private static renderSkillItems(
    skills: Skill[],
    handlers: TemplateHandlers
  ): TemplateResult[] {
    return skills.map(skill => this.renderSkillItem(skill, handlers));
  }

  private static renderSkillItem(
    skill: Skill,
    handlers: TemplateHandlers
  ): TemplateResult {
    const handleNameChange = (e: CustomEvent) => {
      handlers.updateSkill(
        skill.id,
        'name',
        e.detail.value
      );
    };

    const handleLevelChange = (e: CustomEvent) => {
      handlers.updateSkill(
        skill.id,
        'level',
        e.detail.value
      );
    };

    const handleDelete = () => {
      handlers.deleteSkill(skill.id);
    };

    return html`
      <div class="skill-item" key="${skill.id}">
        <div class="form-group">
          <input
            type="text"
            .value="${skill.name}"
            @input="${handleNameChange}"
            placeholder="Skill name"
          />
        </div>
        <div class="form-group">
          <select .value="${skill.level}" @change="${handleLevelChange}">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <button class="btn btn-danger btn-sm" @click="${handleDelete}">
          ${ResumeBuilderIcons.getTrashIcon()}
        </button>
      </div>
    `;
  }
}
