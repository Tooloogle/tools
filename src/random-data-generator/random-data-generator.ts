import { html } from "lit";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import randomDataGeneratorStyles from "./random-data-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import '../t-copy-button/index.js';

@customElement("random-data-generator")
export class RandomDataGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    randomDataGeneratorStyles];

  @property({ type: String }) dataType = "name";
  @property({ type: Number }) count = 10;
  @property({ type: String }) result = "";

  private firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Chris",
    "Emma",
    "James",
    "Lisa"
  ];
  private lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Wilson",
    "Moore"
  ];
  private domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "example.com",
    "test.com"
  ];
  private streets = [
    "Main St",
    "Oak Ave",
    "Park Rd",
    "Elm St",
    "Maple Dr",
    "Lake View",
    "Hill St"
  ];
  private cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio"
  ];
  private indianStreets = [
    "MG Road",
    "Park Street",
    "Brigade Road",
    "Connaught Place",
    "Anna Salai",
    "FC Road",
    "Linking Road",
    "Mall Road",
    "Carter Road",
    "Residency Road"
  ];
  private indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Lucknow"
  ];

  private random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private generateName(): string {
    return `${this.random(this.firstNames)} ${this.random(this.lastNames)}`;
  }

  private generateEmail(): string {
    const first = this.random(this.firstNames).toLowerCase();
    const last = this.random(this.lastNames).toLowerCase();
    return `${first}.${last}@${this.random(this.domains)}`;
  }

  private generatePhone(): string {
    return `+1 (${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(
      Math.random() * 900 + 100
    )}-${Math.floor(Math.random() * 9000 + 1000)}`;
  }

  private generateAddress(): string {
    const num = Math.floor(Math.random() * 9000 + 1000);
    return `${num} ${this.random(this.streets)}, ${this.random(this.cities)}`;
  }

  private generateIndianAddress(): string {
    const num = Math.floor(Math.random() * 500 + 1);
    const pincode = Math.floor(Math.random() * 900000 + 100000);
    return `${num}, ${this.random(this.indianStreets)}, ${this.random(this.indianCities)} - ${pincode}`;
  }

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generate() {
    const safeCount = Math.min(Math.max(this.count || 0, 0), 10000);
    const items: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      switch (this.dataType) {
        case "name":
          items.push(this.generateName());
          break;
        case "email":
          items.push(this.generateEmail());
          break;
        case "phone":
          items.push(this.generatePhone());
          break;
        case "address":
          items.push(this.generateAddress());
          break;
        case "address-india":
          items.push(this.generateIndianAddress());
          break;
        case "uuid":
          items.push(this.generateUUID());
          break;
      }
    }

    this.result = items.join("\n");
  }

  override connectedCallback() {
    super.connectedCallback();
    this.generate();
  }

  private renderDataTypeSelect() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Data Type:</label>
        <select
          class="form-select w-full"
          .value=${this.dataType}
          @change=${(e: Event) => {
            this.dataType = (e.target as HTMLSelectElement).value;
            this.generate();
          }}
        >
          <option value="name">Full Name</option>
          <option value="email">Email Address</option>
          <option value="phone">Phone Number</option>
          <option value="address">Street Address (USA)</option>
          <option value="address-india">Street Address (India)</option>
          <option value="uuid">UUID</option>
        </select>
      </div>
    `;
  }

  private renderCountInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Count:</label>
        <input
          type="number"
          min="1"
          max="10000"
          class="form-input w-full"
          .value=${String(this.count)}
          @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            let val = Number(input.value);
            if (val > 10000) {
              val = 10000;
              input.value = '10000';
            } else if (val < 1 && input.value !== '') {
              val = 1;
              input.value = '1';
            }

            this.count = val;
            this.generate();
          }}
        />
      </div>
    `;
  }

  private renderControls() {
    return html`
      <div class="grid grid-cols-2 gap-4">
        ${this.renderDataTypeSelect()} ${this.renderCountInput()}
      </div>
    `;
  }

  private renderResultTextarea() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Generated Data:</label>
        <textarea
          class="form-textarea w-full h-64 font-mono text-sm"
          readonly
          .value=${this.result}
        ></textarea>
      </div>
    `;
  }

  private renderActions() {
    return html`
      <button class="btn btn-blue btn-sm" @click=${this.generate}>
        Generate New
      </button>
      <t-copy-button .text=${this.result} .isIcon=${false}></t-copy-button>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderControls()} ${this.renderResultTextarea()}
        ${this.renderActions()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "random-data-generator": RandomDataGenerator;
  }
}
