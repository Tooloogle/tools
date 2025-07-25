import { html, TemplateResult } from "lit";
import { PersonalInfo } from "./resume-builder-types.js";
import { TemplateHandlers } from "./resume-builder-templates.js";

export class PersonalInfoTemplate {
  static renderPersonalInfoSection(
    personalInfo: PersonalInfo,
    handlers: TemplateHandlers
  ): TemplateResult {
    return html`
      <div class="section personal-info">
        <h3>Personal Information</h3>
        <div class="form-grid">
          ${this.renderPersonalInfoFields(personalInfo, handlers)}
        </div>
      </div>
    `;
  }

  private static renderPersonalInfoFields(
    personalInfo: PersonalInfo,
    handlers: TemplateHandlers
  ): TemplateResult[] {
    const fields: Array<{
      id: keyof PersonalInfo;
      type: string;
      label: string;
      placeholder: string;
    }> = [
        { id: 'fullName', type: 'text', label: 'Full Name', placeholder: 'John Doe' },
        { id: 'email', type: 'email', label: 'Email', placeholder: 'john.doe@email.com' },
        { id: 'phone', type: 'tel', label: 'Phone', placeholder: '+1 (555) 123-4567' },
        { id: 'location', type: 'text', label: 'Location', placeholder: 'City, State' },
        { id: 'website', type: 'url', label: 'Website', placeholder: 'https://yourwebsite.com' },
        {
          id: 'summary',
          type: 'textarea',
          label: 'Professional Summary',
          placeholder: 'Brief professional summary...',
        }
      ];

    return fields.map(field =>
      this.renderPersonalInfoField(field, personalInfo, handlers)
    );
  }

  private static renderPersonalInfoField(
    field: {
      id: keyof PersonalInfo;
      type: string;
      label: string;
      placeholder: string;
    },
    personalInfo: PersonalInfo,
    handlers: TemplateHandlers
  ): TemplateResult {
    const handleFieldChange = (e: Event) => {
      handlers.handlePersonalInfoChange({
        ...e,
        target: {
          ...e.target,
          name: field.id,
          value: (e.target as HTMLInputElement).value,
        },
      } as Event & { target: { name: string; value: string } });
    };

    if (field.type === "textarea") {
      return html`
        <div class="form-group full-width">
          <label for="${field.id}">${field.label}</label>
          <textarea id="${field.id}" name="${field.id}" .value="${personalInfo[field.id]}"
            @input="${handleFieldChange}"
            placeholder="${field.placeholder}"
            rows="4"
          ></textarea>
        </div>
      `;
    }

    return html`
      <div class="form-group">
        <label for="${field.id}">${field.label}</label>
        <input type="${field.type}" id="${field.id}" name="${field.id}" .value="${personalInfo[field.id]}"
          @input="${handleFieldChange}"
          placeholder="${field.placeholder}"
        />
      </div>
    `;
  }
}