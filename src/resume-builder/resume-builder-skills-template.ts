import { html, TemplateResult } from "lit";
import { Skill } from "./resume-builder-types.js";
import { TemplateHandlers } from "./resume-builder-templates.js";
import { ResumeBuilderIcons } from "./resume-builder-icons.js";

export class SkillTemplate {
  static renderSkillSection(
    skills: Skill[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return html`
      <div class="section skills">
        <div class="section-header">
          <h3>Skills</h3>
          <button class="btn btn-primary" @click="${handlers.addSkill}">
            Add Skill
          </button>
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
    const handleNameChange = (e: Event) => {
      handlers.updateSkill(
        skill.id,
        "name",
        (e.target as HTMLInputElement).value
      );
    };

    const handleLevelChange = (e: Event) => {
      handlers.updateSkill(
        skill.id,
        "level",
        (e.target as HTMLSelectElement).value
      );
    };

    const handleDelete = function (this: SkillTemplate) {
      handlers.deleteSkill(skill.id);
    }.bind(this);

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
        <button
          class="btn btn-danger btn-sm"
          @click="${handleDelete}"
        >
          ${ResumeBuilderIcons.getTrashIcon()}
        </button>
      </div>
    `;
  }
}