/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable lit/no-template-arrow */
import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import weddingBiodataStyles from './wedding-biodata.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import {
  PersonalInfo,
  FamilyDetails,
  EducationOccupation,
  ContactInfo,
  PartnerPreferences,
  WeddingBiodataData,
} from './wedding-biodata-types.js';

@customElement('wedding-biodata')
export class WeddingBiodata extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    weddingBiodataStyles,
  ];

  @property({ type: String }) activeSection = 'personal';
  @property({ type: Boolean }) showPreview = false;

  @property({ type: Object }) personal: PersonalInfo = {
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    age: '',
    height: '',
    weight: '',
    complexion: '',
    bloodGroup: '',
    maritalStatus: 'Never Married',
    motherTongue: '',
    religion: '',
    caste: '',
    subCaste: '',
    gotra: '',
    manglik: 'No',
  };

  @property({ type: Object }) family: FamilyDetails = {
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    brothers: '',
    sisters: '',
    familyType: 'Nuclear',
    familyStatus: 'Middle Class',
    familyValues: 'Traditional',
    nativePlace: '',
  };

  @property({ type: Object }) education: EducationOccupation = {
    highestEducation: '',
    educationDetails: '',
    occupation: '',
    occupationDetails: '',
    annualIncome: '',
    workLocation: '',
  };

  @property({ type: Object }) contact: ContactInfo = {
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
  };

  @property({ type: Object }) preferences: PartnerPreferences = {
    ageRange: '',
    heightRange: '',
    education: '',
    occupation: '',
    location: '',
    otherExpectations: '',
  };

  private handleInputChange(section: keyof WeddingBiodataData, field: string, value: string) {
    if (section === 'personal') {
      this.personal = { ...this.personal, [field]: value };
    } else if (section === 'family') {
      this.family = { ...this.family, [field]: value };
    } else if (section === 'education') {
      this.education = { ...this.education, [field]: value };
    } else if (section === 'contact') {
      this.contact = { ...this.contact, [field]: value };
    } else if (section === 'preferences') {
      this.preferences = { ...this.preferences, [field]: value };
    }
  }

  /* eslint-disable-next-line lit/no-template-map */
  private renderNavigation() {
    const sections = [
      { id: 'personal', label: 'Personal Info' },
      { id: 'family', label: 'Family Details' },
      { id: 'education', label: 'Education & Job' },
      { id: 'contact', label: 'Contact Info' },
      { id: 'preferences', label: 'Partner Preferences' },
    ];

    return html`
      <div class="section-navigation">
        ${sections.map(
          section => html`
            <button
              class="nav-btn ${this.activeSection === section.id ? 'active' : ''}"
              @click=${() => {
                this.activeSection = section.id;
                this.showPreview = false;
              }}
            >
              ${section.label}
            </button>
          `
        )}
        <button
          class="nav-btn preview-btn ${this.showPreview ? 'active' : ''}"
          @click=${() => {
            this.showPreview = true;
          }}
        >
          Preview
        </button>
      </div>
    `;
  }

  private renderPersonalInfo() {
    return html`
      <div class="form-section">
        <h3>Personal Information</h3>
        <div class="form-grid">
          <label class="form-group">
            <span>Full Name *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.fullName}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'fullName',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="Enter full name"
            />
          </label>

          <label class="form-group">
            <span>Date of Birth *</span>
            <input
              type="date"
              class="form-input"
              .value=${this.personal.dateOfBirth}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'dateOfBirth',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Time of Birth</span>
            <input
              type="time"
              class="form-input"
              .value=${this.personal.timeOfBirth}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'timeOfBirth',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Place of Birth</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.placeOfBirth}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'placeOfBirth',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="City, State"
            />
          </label>

          <label class="form-group">
            <span>Age *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.age}
              @input=${(e: Event) =>
                this.handleInputChange('personal', 'age', (e.target as HTMLInputElement).value)}
              placeholder="e.g., 25 years"
            />
          </label>

          <label class="form-group">
            <span>Height *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.height}
              @input=${(e: Event) =>
                this.handleInputChange('personal', 'height', (e.target as HTMLInputElement).value)}
              placeholder='e.g., 5&apos;6"'
            />
          </label>

          <label class="form-group">
            <span>Weight</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.weight}
              @input=${(e: Event) =>
                this.handleInputChange('personal', 'weight', (e.target as HTMLInputElement).value)}
              placeholder="e.g., 65 kg"
            />
          </label>

          <label class="form-group">
            <span>Complexion</span>
            <select
              class="form-select"
              .value=${this.personal.complexion}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'complexion',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="">Select</option>
              <option value="Fair">Fair</option>
              <option value="Wheatish">Wheatish</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
            </select>
          </label>

          <label class="form-group">
            <span>Blood Group</span>
            <select
              class="form-select"
              .value=${this.personal.bloodGroup}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'bloodGroup',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </label>

          <label class="form-group">
            <span>Marital Status *</span>
            <select
              class="form-select"
              .value=${this.personal.maritalStatus}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'maritalStatus',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="Never Married">Never Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </label>

          <label class="form-group">
            <span>Mother Tongue</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.motherTongue}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'motherTongue',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., Hindi, English"
            />
          </label>

          <label class="form-group">
            <span>Religion</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.religion}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'religion',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., Hindu, Muslim, Christian"
            />
          </label>

          <label class="form-group">
            <span>Caste</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.caste}
              @input=${(e: Event) =>
                this.handleInputChange('personal', 'caste', (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="form-group">
            <span>Sub-Caste</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.subCaste}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'subCaste',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Gotra</span>
            <input
              type="text"
              class="form-input"
              .value=${this.personal.gotra}
              @input=${(e: Event) =>
                this.handleInputChange('personal', 'gotra', (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="form-group">
            <span>Manglik</span>
            <select
              class="form-select"
              .value=${this.personal.manglik}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'personal',
                  'manglik',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </label>
        </div>
      </div>
    `;
  }

  private renderFamilyDetails() {
    return html`
      <div class="form-section">
        <h3>Family Details</h3>
        <div class="form-grid">
          <label class="form-group">
            <span>Father's Name *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.fatherName}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'fatherName',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Father's Occupation</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.fatherOccupation}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'fatherOccupation',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Mother's Name *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.motherName}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'motherName',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Mother's Occupation</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.motherOccupation}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'motherOccupation',
                  (e.target as HTMLInputElement).value
                )}
            />
          </label>

          <label class="form-group">
            <span>Brothers</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.brothers}
              @input=${(e: Event) =>
                this.handleInputChange('family', 'brothers', (e.target as HTMLInputElement).value)}
              placeholder="e.g., 1 (Married), 1 (Unmarried)"
            />
          </label>

          <label class="form-group">
            <span>Sisters</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.sisters}
              @input=${(e: Event) =>
                this.handleInputChange('family', 'sisters', (e.target as HTMLInputElement).value)}
              placeholder="e.g., 1 (Married), 1 (Unmarried)"
            />
          </label>

          <label class="form-group">
            <span>Family Type</span>
            <select
              class="form-select"
              .value=${this.family.familyType}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'familyType',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="Nuclear">Nuclear</option>
              <option value="Joint">Joint</option>
            </select>
          </label>

          <label class="form-group">
            <span>Family Status</span>
            <select
              class="form-select"
              .value=${this.family.familyStatus}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'familyStatus',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="Lower Class">Lower Class</option>
              <option value="Middle Class">Middle Class</option>
              <option value="Upper Middle Class">Upper Middle Class</option>
              <option value="Upper Class">Upper Class</option>
            </select>
          </label>

          <label class="form-group">
            <span>Family Values</span>
            <select
              class="form-select"
              .value=${this.family.familyValues}
              @change=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'familyValues',
                  (e.target as HTMLSelectElement).value
                )}
            >
              <option value="Traditional">Traditional</option>
              <option value="Moderate">Moderate</option>
              <option value="Liberal">Liberal</option>
            </select>
          </label>

          <label class="form-group span-2">
            <span>Native Place</span>
            <input
              type="text"
              class="form-input"
              .value=${this.family.nativePlace}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'family',
                  'nativePlace',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="City, State"
            />
          </label>
        </div>
      </div>
    `;
  }

  private renderEducationOccupation() {
    return html`
      <div class="form-section">
        <h3>Education & Occupation</h3>
        <div class="form-grid">
          <label class="form-group">
            <span>Highest Education *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.education.highestEducation}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'education',
                  'highestEducation',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., B.Tech, MBA, M.Sc"
            />
          </label>

          <label class="form-group span-2">
            <span>Education Details</span>
            <textarea
              class="form-textarea"
              .value=${this.education.educationDetails}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'education',
                  'educationDetails',
                  (e.target as HTMLTextAreaElement).value
                )}
              rows="2"
              placeholder="College/University name, year of passing, etc."
            ></textarea>
          </label>

          <label class="form-group">
            <span>Occupation *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.education.occupation}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'education',
                  'occupation',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., Software Engineer, Doctor"
            />
          </label>

          <label class="form-group span-2">
            <span>Occupation Details</span>
            <textarea
              class="form-textarea"
              .value=${this.education.occupationDetails}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'education',
                  'occupationDetails',
                  (e.target as HTMLTextAreaElement).value
                )}
              rows="2"
              placeholder="Company name, designation, experience, etc."
            ></textarea>
          </label>

          <label class="form-group">
            <span>Annual Income</span>
            <input
              type="text"
              class="form-input"
              .value=${this.education.annualIncome}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'education',
                  'annualIncome',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., 10-15 LPA"
            />
          </label>

          <label class="form-group">
            <span>Work Location</span>
            <input
              type="text"
              class="form-input"
              .value=${this.education.workLocation}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'education',
                  'workLocation',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="City, State, Country"
            />
          </label>
        </div>
      </div>
    `;
  }

  private renderContactInfo() {
    return html`
      <div class="form-section">
        <h3>Contact Information</h3>
        <div class="form-grid">
          <label class="form-group span-2">
            <span>Address *</span>
            <textarea
              class="form-textarea"
              .value=${this.contact.address}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'contact',
                  'address',
                  (e.target as HTMLTextAreaElement).value
                )}
              rows="2"
              placeholder="Enter full address"
            ></textarea>
          </label>

          <label class="form-group">
            <span>City *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.contact.city}
              @input=${(e: Event) =>
                this.handleInputChange('contact', 'city', (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="form-group">
            <span>State *</span>
            <input
              type="text"
              class="form-input"
              .value=${this.contact.state}
              @input=${(e: Event) =>
                this.handleInputChange('contact', 'state', (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="form-group">
            <span>Pincode</span>
            <input
              type="text"
              class="form-input"
              .value=${this.contact.pincode}
              @input=${(e: Event) =>
                this.handleInputChange('contact', 'pincode', (e.target as HTMLInputElement).value)}
              placeholder="6-digit pincode"
            />
          </label>

          <label class="form-group">
            <span>Phone *</span>
            <input
              type="tel"
              class="form-input"
              .value=${this.contact.phone}
              @input=${(e: Event) =>
                this.handleInputChange('contact', 'phone', (e.target as HTMLInputElement).value)}
              placeholder="+91 XXXXXXXXXX"
            />
          </label>

          <label class="form-group span-2">
            <span>Email</span>
            <input
              type="email"
              class="form-input"
              .value=${this.contact.email}
              @input=${(e: Event) =>
                this.handleInputChange('contact', 'email', (e.target as HTMLInputElement).value)}
              placeholder="your.email@example.com"
            />
          </label>
        </div>
      </div>
    `;
  }

  private renderPartnerPreferences() {
    return html`
      <div class="form-section">
        <h3>Partner Preferences</h3>
        <div class="form-grid">
          <label class="form-group">
            <span>Age Range</span>
            <input
              type="text"
              class="form-input"
              .value=${this.preferences.ageRange}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'preferences',
                  'ageRange',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., 23-28 years"
            />
          </label>

          <label class="form-group">
            <span>Height Range</span>
            <input
              type="text"
              class="form-input"
              .value=${this.preferences.heightRange}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'preferences',
                  'heightRange',
                  (e.target as HTMLInputElement).value
                )}
              placeholder='e.g., 5&apos;4" - 5&apos;8"'
            />
          </label>

          <label class="form-group span-2">
            <span>Education</span>
            <input
              type="text"
              class="form-input"
              .value=${this.preferences.education}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'preferences',
                  'education',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., Graduate or above"
            />
          </label>

          <label class="form-group span-2">
            <span>Occupation</span>
            <input
              type="text"
              class="form-input"
              .value=${this.preferences.occupation}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'preferences',
                  'occupation',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., Any professional job"
            />
          </label>

          <label class="form-group span-2">
            <span>Location Preference</span>
            <input
              type="text"
              class="form-input"
              .value=${this.preferences.location}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'preferences',
                  'location',
                  (e.target as HTMLInputElement).value
                )}
              placeholder="e.g., Anywhere in India"
            />
          </label>

          <label class="form-group span-2">
            <span>Other Expectations</span>
            <textarea
              class="form-textarea"
              .value=${this.preferences.otherExpectations}
              @input=${(e: Event) =>
                this.handleInputChange(
                  'preferences',
                  'otherExpectations',
                  (e.target as HTMLTextAreaElement).value
                )}
              rows="3"
              placeholder="Any other preferences or expectations..."
            ></textarea>
          </label>
        </div>
      </div>
    `;
  }

  private renderPreview() {
    return html`
      <div class="preview-container">
        <div class="preview-actions">
          <button class="btn btn-blue" @click=${this.handlePrint}>Print Biodata</button>
        </div>

        <div class="biodata-preview" id="biodata-print">
          <div class="preview-header">
            <h1>Wedding Biodata</h1>
          </div>

          <div class="preview-section">
            <h2>Personal Information</h2>
            <div class="preview-grid">
              ${this.personal.fullName
                ? html`<div class="preview-item">
                    <strong>Name:</strong> ${this.personal.fullName}
                  </div>`
                : ''}
              ${this.personal.dateOfBirth
                ? html`<div class="preview-item">
                    <strong>Date of Birth:</strong> ${this.personal.dateOfBirth}
                  </div>`
                : ''}
              ${this.personal.timeOfBirth
                ? html`<div class="preview-item">
                    <strong>Time of Birth:</strong> ${this.personal.timeOfBirth}
                  </div>`
                : ''}
              ${this.personal.placeOfBirth
                ? html`<div class="preview-item">
                    <strong>Place of Birth:</strong> ${this.personal.placeOfBirth}
                  </div>`
                : ''}
              ${this.personal.age
                ? html`<div class="preview-item"><strong>Age:</strong> ${this.personal.age}</div>`
                : ''}
              ${this.personal.height
                ? html`<div class="preview-item">
                    <strong>Height:</strong> ${this.personal.height}
                  </div>`
                : ''}
              ${this.personal.weight
                ? html`<div class="preview-item">
                    <strong>Weight:</strong> ${this.personal.weight}
                  </div>`
                : ''}
              ${this.personal.complexion
                ? html`<div class="preview-item">
                    <strong>Complexion:</strong> ${this.personal.complexion}
                  </div>`
                : ''}
              ${this.personal.bloodGroup
                ? html`<div class="preview-item">
                    <strong>Blood Group:</strong> ${this.personal.bloodGroup}
                  </div>`
                : ''}
              ${this.personal.maritalStatus
                ? html`<div class="preview-item">
                    <strong>Marital Status:</strong> ${this.personal.maritalStatus}
                  </div>`
                : ''}
              ${this.personal.motherTongue
                ? html`<div class="preview-item">
                    <strong>Mother Tongue:</strong> ${this.personal.motherTongue}
                  </div>`
                : ''}
              ${this.personal.religion
                ? html`<div class="preview-item">
                    <strong>Religion:</strong> ${this.personal.religion}
                  </div>`
                : ''}
              ${this.personal.caste
                ? html`<div class="preview-item">
                    <strong>Caste:</strong> ${this.personal.caste}
                  </div>`
                : ''}
              ${this.personal.subCaste
                ? html`<div class="preview-item">
                    <strong>Sub-Caste:</strong> ${this.personal.subCaste}
                  </div>`
                : ''}
              ${this.personal.gotra
                ? html`<div class="preview-item">
                    <strong>Gotra:</strong> ${this.personal.gotra}
                  </div>`
                : ''}
              ${this.personal.manglik
                ? html`<div class="preview-item">
                    <strong>Manglik:</strong> ${this.personal.manglik}
                  </div>`
                : ''}
            </div>
          </div>

          <div class="preview-section">
            <h2>Family Details</h2>
            <div class="preview-grid">
              ${this.family.fatherName
                ? html`<div class="preview-item">
                    <strong>Father's Name:</strong> ${this.family.fatherName}
                  </div>`
                : ''}
              ${this.family.fatherOccupation
                ? html`<div class="preview-item">
                    <strong>Father's Occupation:</strong> ${this.family.fatherOccupation}
                  </div>`
                : ''}
              ${this.family.motherName
                ? html`<div class="preview-item">
                    <strong>Mother's Name:</strong> ${this.family.motherName}
                  </div>`
                : ''}
              ${this.family.motherOccupation
                ? html`<div class="preview-item">
                    <strong>Mother's Occupation:</strong> ${this.family.motherOccupation}
                  </div>`
                : ''}
              ${this.family.brothers
                ? html`<div class="preview-item">
                    <strong>Brothers:</strong> ${this.family.brothers}
                  </div>`
                : ''}
              ${this.family.sisters
                ? html`<div class="preview-item">
                    <strong>Sisters:</strong> ${this.family.sisters}
                  </div>`
                : ''}
              ${this.family.familyType
                ? html`<div class="preview-item">
                    <strong>Family Type:</strong> ${this.family.familyType}
                  </div>`
                : ''}
              ${this.family.familyStatus
                ? html`<div class="preview-item">
                    <strong>Family Status:</strong> ${this.family.familyStatus}
                  </div>`
                : ''}
              ${this.family.familyValues
                ? html`<div class="preview-item">
                    <strong>Family Values:</strong> ${this.family.familyValues}
                  </div>`
                : ''}
              ${this.family.nativePlace
                ? html`<div class="preview-item">
                    <strong>Native Place:</strong> ${this.family.nativePlace}
                  </div>`
                : ''}
            </div>
          </div>

          <div class="preview-section">
            <h2>Education & Occupation</h2>
            <div class="preview-grid">
              ${this.education.highestEducation
                ? html`<div class="preview-item">
                    <strong>Highest Education:</strong> ${this.education.highestEducation}
                  </div>`
                : ''}
              ${this.education.educationDetails
                ? html`<div class="preview-item span-full">
                    <strong>Education Details:</strong> ${this.education.educationDetails}
                  </div>`
                : ''}
              ${this.education.occupation
                ? html`<div class="preview-item">
                    <strong>Occupation:</strong> ${this.education.occupation}
                  </div>`
                : ''}
              ${this.education.occupationDetails
                ? html`<div class="preview-item span-full">
                    <strong>Occupation Details:</strong> ${this.education.occupationDetails}
                  </div>`
                : ''}
              ${this.education.annualIncome
                ? html`<div class="preview-item">
                    <strong>Annual Income:</strong> ${this.education.annualIncome}
                  </div>`
                : ''}
              ${this.education.workLocation
                ? html`<div class="preview-item">
                    <strong>Work Location:</strong> ${this.education.workLocation}
                  </div>`
                : ''}
            </div>
          </div>

          <div class="preview-section">
            <h2>Contact Information</h2>
            <div class="preview-grid">
              ${this.contact.address
                ? html`<div class="preview-item span-full">
                    <strong>Address:</strong> ${this.contact.address}
                  </div>`
                : ''}
              ${this.contact.city
                ? html`<div class="preview-item"><strong>City:</strong> ${this.contact.city}</div>`
                : ''}
              ${this.contact.state
                ? html`<div class="preview-item">
                    <strong>State:</strong> ${this.contact.state}
                  </div>`
                : ''}
              ${this.contact.pincode
                ? html`<div class="preview-item">
                    <strong>Pincode:</strong> ${this.contact.pincode}
                  </div>`
                : ''}
              ${this.contact.phone
                ? html`<div class="preview-item">
                    <strong>Phone:</strong> ${this.contact.phone}
                  </div>`
                : ''}
              ${this.contact.email
                ? html`<div class="preview-item span-full">
                    <strong>Email:</strong> ${this.contact.email}
                  </div>`
                : ''}
            </div>
          </div>

          <div class="preview-section">
            <h2>Partner Preferences</h2>
            <div class="preview-grid">
              ${this.preferences.ageRange
                ? html`<div class="preview-item">
                    <strong>Age Range:</strong> ${this.preferences.ageRange}
                  </div>`
                : ''}
              ${this.preferences.heightRange
                ? html`<div class="preview-item">
                    <strong>Height Range:</strong> ${this.preferences.heightRange}
                  </div>`
                : ''}
              ${this.preferences.education
                ? html`<div class="preview-item span-full">
                    <strong>Education:</strong> ${this.preferences.education}
                  </div>`
                : ''}
              ${this.preferences.occupation
                ? html`<div class="preview-item span-full">
                    <strong>Occupation:</strong> ${this.preferences.occupation}
                  </div>`
                : ''}
              ${this.preferences.location
                ? html`<div class="preview-item span-full">
                    <strong>Location Preference:</strong> ${this.preferences.location}
                  </div>`
                : ''}
              ${this.preferences.otherExpectations
                ? html`<div class="preview-item span-full">
                    <strong>Other Expectations:</strong> ${this.preferences.otherExpectations}
                  </div>`
                : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private handlePrint() {
    window.print();
  }

  override render() {
    return html`
      <div class="wedding-biodata-container">
        ${this.renderNavigation()}

        <div class="content-area">
          ${this.showPreview
            ? this.renderPreview()
            : html`
                ${this.activeSection === 'personal' ? this.renderPersonalInfo() : ''}
                ${this.activeSection === 'family' ? this.renderFamilyDetails() : ''}
                ${this.activeSection === 'education' ? this.renderEducationOccupation() : ''}
                ${this.activeSection === 'contact' ? this.renderContactInfo() : ''}
                ${this.activeSection === 'preferences' ? this.renderPartnerPreferences() : ''}
              `}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wedding-biodata': WeddingBiodata;
  }
}
