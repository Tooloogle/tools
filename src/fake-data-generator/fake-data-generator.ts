import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import fakeDataGeneratorStyles from "./fake-data-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";
import '../t-button';
import '../t-input';
import '../t-textarea';

@customElement("fake-data-generator")
export class FakeDataGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    fakeDataGeneratorStyles];

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
    "Lisa"];
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
    "Moore"];
  private domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "example.com",
    "test.com"];
  private streets = [
    "Main St",
    "Oak Ave",
    "Park Rd",
    "Elm St",
    "Maple Dr",
    "Lake View",
    "Hill St"];
  private cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio"];

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

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generate() {
    const items: string[] = [];

    for (let i = 0; i < this.count; i++) {
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
        case "uuid":
          items.push(this.generateUUID());
          break;
      }
    }

    this.result = items.join("\n");
  }

  connectedCallback() {
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
          @change=${(e: CustomEvent) => {
            this.dataType = e.detail.value;
            this.generate();
          }}
        >
          <option value="name">Full Name</option>
          <option value="email">Email Address</option>
          <option value="phone">Phone Number</option>
          <option value="address">Street Address</option>
          <option value="uuid">UUID</option>
        </select>
      </div>
    `;
  }

  private renderCountInput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Count:</label>
        <t-input type="number" class="w-full"></t-input> {
            this.count = Number(e.detail.value);
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
        <t-textarea ?readonly=${true} class="w-full h-64 font-mono text-sm"></t-textarea>
      </div>
    `;
  }

  private renderActions() {
    return html`
      <t-button variant="blue" class="btn-sm">
        Generate New
      </t-button>
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
    "fake-data-generator": FakeDataGenerator;
  }
}
