import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import cssGradientGeneratorStyles from './css-gradient-generator.css.js'; // Import for CSS styles
import '../t-input';

@customElement('css-gradient-generator')
export class CssGradientGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, cssGradientGeneratorStyles];

    @property({ type: String }) color1 = '#ff0000'; // Default color 1
    @property({ type: String }) color2 = '#0000ff'; // Default color 2
    @property({ type: String }) gradientType = 'linear'; // Default gradient type
    @property({ type: Number }) angle = 90; // Default gradient angle for linear gradient

    connectedCallback() {
        super.connectedCallback();
        this.onColorInputChange = this.onColorInputChange.bind(this);
        this.initColorPickers();
    }

    private initColorPickers() {
        if (!this.shadowRoot) {
            return;
        }

        const colorPickers = this.shadowRoot.querySelectorAll('input[type="color"]') as NodeListOf<HTMLInputElement>;
        colorPickers.forEach(picker => picker.addEventListener('input', this.onColorInputChange.bind(this)));
    }

    private onColorInputChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.id === 'colorPicker1') {
            this.color1 = inputElement.value.toUpperCase();
        } else if (inputElement.id === 'colorPicker2') {
            this.color2 = inputElement.value.toUpperCase();
        }

        this.requestUpdate();
    }



    private onGradientTypeChange(event: Event) {
        const buttonElement = event.currentTarget as HTMLButtonElement;
        this.gradientType = buttonElement.value;
        this.requestUpdate();
    }

    private onAngleChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.angle = parseInt(inputElement.value, 10);
        this.requestUpdate();
    }

    private generateGradient() {
        if (this.gradientType === 'linear') {
            return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`;
        } else if (this.gradientType === 'radial') {
            return `radial-gradient(${this.color1}, ${this.color2})`;
        }

        return '';
    }

    private generateSolidBackground() {
        return `${this.color1}`;
    }

    render() {
        const gradientStyle = this.generateGradient();
        const solidBackground = this.generateSolidBackground();

        return html`
            <div class="css-gradient-generator">
            <div class="preview-box" style="background: ${gradientStyle};"></div>
                <div class="controls">
                    <div class="color-picker">
                        <label for="colorPicker1">Color 1:</label>
                        <input id="colorPicker1" type="color" .value="${this.color1}" @input=${this.onColorInputChange}>
                        <t-input id="colorInput1" .value="${String(this.color1)}" @t-input=${(e: CustomEvent) => { this.color1 = e.detail.value.toUpperCase(); this.requestUpdate(); }}></t-input>
                    </div>

                    <div class="color-picker">
                        <label for="colorPicker2">Color 2:</label>
                        <input id="colorPicker2" type="color" .value="${this.color2}" @input=${this.onColorInputChange}>
                        <t-input id="colorInput2" .value="${String(this.color2)}" @t-input=${(e: CustomEvent) => { this.color2 = e.detail.value.toUpperCase(); this.requestUpdate(); }}></t-input>
                    </div>

                    <div class="gradient-type">
                        <label>Gradient Type:</label>
                        <button @click="${this.onGradientTypeChange}" value="linear" class="${this.gradientType === 'linear' ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M3 3h18v18h-18v-18zm2 2v14h14v-14h-14zm4.5 1h5v12h-5v-12zm-3.5 2.5h2v7h-2v-7zm10 0h2v7h-2v-7zm-3.5 1h2v9h-2v-9z"/>
                        </svg> Linear
                        </button>
                        <button @click="${this.onGradientTypeChange}" value="radial" class="${this.gradientType === 'radial' ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9zm2 0c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7-7 3.14-7 7zm7-5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                        </svg> Radial
                        </button>
                    </div>

                    ${this.gradientType === 'linear' ? html`
                        <label for="angle">Angle:</label>
                        <input id="angle" type="range" min="0" max="360" .value="${this.angle}" @input="${this.onAngleChange}">
                        <span>${this.angle}°</span>
                    ` : ''}
                </div>
                
                <div class="gradient-css">
                <p>CSS Code:</p>
                <code>background: ${solidBackground};</code>
                <code>background: ${gradientStyle};</code>
                </div>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-gradient-generator': CssGradientGenerator;
    }
}
