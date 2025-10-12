import { html, TemplateResult } from 'lit';
import { Experience } from './resume-builder-types.js';
import { TemplateHandlers } from './resume-builder-templates.js';

export class ExperienceTemplate {
  static renderExperienceSection(
    experiences: Experience[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return html`
      <div class="section experience">
        <div class="section-header">
          <h3>Work Experience</h3>
          <button class="btn btn-primary" @click="${handlers.addExperience}">
            Add Experience
          </button>
        </div>
        ${this.renderExperienceItems(experiences, handlers)}
      </div>
    `;
  }

  private static renderExperienceItems(
    experiences: Experience[],
    handlers: TemplateHandlers
  ): TemplateResult[] {
    return experiences.map(exp => this.renderExperienceItem(exp, handlers));
  }

  private static renderExperienceItem(
    exp: Experience,
    handlers: TemplateHandlers
  ): TemplateResult {
    const handleDelete = () => {
      handlers.deleteExperience(exp.id);
    };

    return html`
      <div class="experience-item" key="${exp.id}">
        <div class="item-header">
          <h4>Experience Entry</h4>
          <button class="btn btn-danger" @click="${handleDelete}">
            Delete
          </button>
        </div>
        <div class="form-grid">
          ${this.renderExperienceFields(exp, handlers)}
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line max-lines-per-function
  private static renderExperienceFields(
    exp: Experience,
    handlers: TemplateHandlers
  ): TemplateResult[] {
    const fields: Array<{
      field: keyof Experience;
      type: string;
      label: string;
      placeholder?: string;
      disabled?: boolean;
      isCheckbox?: boolean;
    }> = [
      {
        field: 'company',
        type: 'text',
        label: 'Company',
        placeholder: 'Company Name',
      },
      {
        field: 'position',
        type: 'text',
        label: 'Position',
        placeholder: 'Job Title',
      },
      {
        field: 'location',
        type: 'text',
        label: 'Location',
        placeholder: 'City, State',
      },
      { field: 'startDate', type: 'date', label: 'Start Date' },
      {
        field: 'endDate',
        type: 'date',
        label: 'End Date',
        disabled: exp.current,
      },
      {
        field: 'current',
        type: 'checkbox',
        label: 'Current Position',
        isCheckbox: true,
      },
      {
        field: 'description',
        type: 'textarea',
        label: 'Job Description',
        placeholder: 'Describe your responsibilities and achievements...',
      },
    ];

    return fields.map(field =>
      this.renderExperienceField(field, exp, handlers)
    );
  }

  // eslint-disable-next-line max-lines-per-function
  private static renderExperienceField(
    fieldInfo: {
      field: keyof Experience;
      type: string;
      label: string;
      placeholder?: string;
      disabled?: boolean;
      isCheckbox?: boolean;
    },
    exp: Experience,
    handlers: TemplateHandlers
  ): TemplateResult {
    const handleFieldChange = (e: Event) => {
      const value =
        fieldInfo.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : (e.target as HTMLInputElement).value;
      handlers.updateExperience(exp.id, fieldInfo.field, value);
    };

    if (fieldInfo.type === 'textarea') {
      return html`
        <div class="form-group full-width">
          <label>${fieldInfo.label}</label>
          <textarea
            .value="${exp[fieldInfo.field] as string}"
            @input="${handleFieldChange}"
            placeholder="${fieldInfo.placeholder || ''}"
            rows="4"
            ?disabled="${fieldInfo.disabled}"
          ></textarea>
        </div>
      `;
    }

    if (fieldInfo.type === 'checkbox' || fieldInfo.isCheckbox) {
      return html`
        <div class="form-group">
          <label class="checkbox-group-label">
            <input
              type="checkbox"
              .checked="${exp.current}"
              @change="${handleFieldChange}"
            />
            ${fieldInfo.label}
          </label>
        </div>
      `;
    }

    return html`
      <div class="form-group">
        <label>${fieldInfo.label}</label>
        <input
          type="${fieldInfo.type}"
          .value="${exp[fieldInfo.field] as string}"
          @input="${handleFieldChange}"
          placeholder="${fieldInfo.placeholder || ''}"
          ?disabled="${fieldInfo.disabled}"
        />
      </div>
    `;
  }
}
