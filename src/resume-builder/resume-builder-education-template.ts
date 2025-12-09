import { html, TemplateResult } from 'lit';
import { Education } from './resume-builder-types.js';
import { TemplateHandlers } from './resume-builder-templates.js';
import '../t-button/t-button.js';

export class EducationTemplate {
  static renderEducationSection(
    education: Education[],
    handlers: TemplateHandlers
  ): TemplateResult {
    return html`
      <div class="section education">
        <div class="section-header">
          <h3>Education</h3>
          <t-button variant="blue" @click="${handlers.addEducation}">
            Add Education
          </t-button>
        </div>
        ${this.renderEducationItems(education, handlers)}
      </div>
    `;
  }

  private static renderEducationItems(
    education: Education[],
    handlers: TemplateHandlers
  ): TemplateResult[] {
    return education.map(edu => this.renderEducationItem(edu, handlers));
  }

  private static renderEducationItem(
    edu: Education,
    handlers: TemplateHandlers
  ): TemplateResult {
    const handleDelete = () => {
      handlers.deleteEducation(edu.id);
    };

    return html`
      <div class="education-item" key="${edu.id}">
        <div class="item-header">
          <h4>Education Entry</h4>
          <button class="btn btn-danger" @click="${handleDelete}">
            Delete
          </button>
        </div>
        <div class="form-grid">
          ${this.renderEducationFields(edu, handlers)}
        </div>
      </div>
    `;
  }

  private static renderEducationFields(
    edu: Education,
    handlers: TemplateHandlers
  ): TemplateResult[] {
    const fields: Array<{
      field: keyof Education;
      type: string;
      label: string;
      placeholder?: string;
    }> = [
      {
        field: 'institution',
        type: 'text',
        label: 'Institution',
        placeholder: 'University Name',
      },
      {
        field: 'degree',
        type: 'text',
        label: 'Degree',
        placeholder: "Bachelor's, Master's, etc.",
      },
      {
        field: 'field',
        type: 'text',
        label: 'Field of Study',
        placeholder: 'Computer Science, Business, etc.',
      },
      { field: 'graduationDate', type: 'date', label: 'Graduation Date' },
      {
        field: 'gpa',
        type: 'text',
        label: 'GPA (Optional)',
        placeholder: '3.8/4.0',
      }];

    return fields.map(field => this.renderEducationField(field, edu, handlers));
  }

  private static renderEducationField(
    fieldInfo: {
      field: keyof Education;
      type: string;
      label: string;
      placeholder?: string;
    },
    edu: Education,
    handlers: TemplateHandlers
  ): TemplateResult {
    const handleFieldChange = (e: CustomEvent) => {
      handlers.updateEducation(
        edu.id,
        fieldInfo.field,
        e.detail.value
      );
    };

    return html`
      <div class="form-group">
        <label>${fieldInfo.label}</label>
        <input
          type="${fieldInfo.type}"
          .value="${edu[fieldInfo.field]}"
          @input="${handleFieldChange}"
          placeholder="${fieldInfo.placeholder || ''}"
        />
      </div>
    `;
  }
}
