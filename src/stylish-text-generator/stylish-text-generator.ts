import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import { customElement, property, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import stylishTextGeneratorStyles from './stylish-text-generator.css.js';

@customElement('stylish-text-generator')
export class StylishTextGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [
        WebComponentBase.styles, 
        inputStyles, 
        buttonStyles,
        stylishTextGeneratorStyles
    ];

    @property()
    text = "Stylish Text";

    @state()
    private fontSize = 72;

    @state()
    private fontFamily = 'Poppins';

    @state()
    private textColor = '#3b82f6'; 

    @state()
    private backgroundColor = '#ffffff';

    @state()
    private strokeWidth = 2;

    @state()
    private strokeColor = '#1e40af'; 

    @state()
    private shadowBlur = 5;

    @state()
    private shadowColor = '#9ca3af'; 

    @state()
    private shadowOffsetX = 3;

    @state()
    private shadowOffsetY = 3;

    @state()
    private canvasWidth = 800;

    @state()
    private canvasHeight = 300;

    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    
    private fontOptions = [
    // Sans-serif (modern)
    { name: 'Poppins', category: 'sans-serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Open Sans', category: 'sans-serif' },
    { name: 'Roboto', category: 'sans-serif' },
    { name: 'Lato', category: 'sans-serif' },
    { name: 'Raleway', category: 'sans-serif' },
    { name: 'Nunito', category: 'sans-serif' },
    
    // Serif (classic)
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Merriweather', category: 'serif' },
    { name: 'Georgia', category: 'serif' },
    { name: 'Times New Roman', category: 'serif' },
    
    // Display (bold/attention-grabbing)
    { name: 'Impact', category: 'display' },
    { name: 'Oswald', category: 'display' },
    { name: 'Arial Black', category: 'display' },
    
    // Handwriting (casual)
    { name: 'Dancing Script', category: 'handwriting' },
    { name: 'Pacifico', category: 'handwriting' },
    { name: 'Caveat', category: 'handwriting' },
    
    // System fallbacks
    { name: 'Arial', category: 'system' },
    { name: 'Helvetica', category: 'system' },
    { name: 'Verdana', category: 'system' },
    { name: 'Trebuchet MS', category: 'system' }
]   ;

    
    firstUpdated() {
        this.canvas = this.shadowRoot?.getElementById('textCanvas') as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas.');
        }
        this.ctx = ctx;
        this.generateImage();
        
        this.loadWebFonts();
    }
 
    async loadWebFonts() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Montserrat&family=Roboto&family=Open+Sans&family=Lato&family=Raleway&family=Playfair+Display&family=Merriweather&family=Oswald&family=Nunito&family=Dancing+Script&family=Pacifico&family=Caveat&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

    generateImage() {
        if (!this.canvas || !this.ctx) return;

        // Set canvas size
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        // Clear canvas
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Set text properties
        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Set shadow
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowColor = this.shadowColor;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;

        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;

        // Draw stroke if enabled
        if (this.strokeWidth > 0) {
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.strokeText(this.text, centerX, centerY);
        }

        // Draw fill text
        this.ctx.fillStyle = this.textColor;
        this.ctx.fillText(this.text, centerX, centerY);

        // Reset shadow for future draws
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'stylish-text.png';
        link.href = this.canvas.toDataURL('image/png', 1.0);
        link.click();
    }

    resetSettings() {
        this.fontSize = 72;
        this.fontFamily = 'Poppins';
        this.textColor = '#3b82f6';
        this.backgroundColor = '#ffffff';
        this.strokeWidth = 2;
        this.strokeColor = '#1e40af';
        this.shadowBlur = 5;
        this.shadowColor = '#9ca3af';
        this.shadowOffsetX = 3;
        this.shadowOffsetY = 3;
        this.canvasWidth = 800;
        this.canvasHeight = 300;
        this.generateImage();
    }

    override render() {
        return html`
            <div class="generator-container">
                <div class="text-input-section">
                    <label class="block py-1">
                        <textarea
                            class="form-textarea"
                            autofocus
                            placeholder="Enter your text here..."
                            rows="2"
                            .value=${this.text}
                            @input=${(e: any) => {
                                this.text = e.target.value;
                                this.generateImage();
                            }}></textarea>
                    </label>
                </div>

                <div class="preview-section">
                    <div class="canvas-container">
                        <canvas id="textCanvas"></canvas>
                    </div>
                </div>

                <div class="btns">
                    <button class="btn btn-primary" @click=${this.downloadImage}>Download PNG</button>
                    <button class="btn btn-secondary" @click=${this.resetSettings}>Reset Settings</button>
                </div>

                <div class="controls-section">
                    <div class="control-group">
                        <h4>Canvas Size</h4>
                        <input type="range" class="range-input" min="300" max="1200" step="50" .value=${this.canvasWidth.toString()} @input=${(e: any) => {
                            this.canvasWidth = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">Width: ${this.canvasWidth}px</div>
                        <input type="range" class="range-input" min="100" max="800" step="25" .value=${this.canvasHeight.toString()} @input=${(e: any) => {
                            this.canvasHeight = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">Height: ${this.canvasHeight}px</div>
                    </div>
                    
                    <div class="control-group">
                        <h4>Font</h4>
                        <select class="font-select" .value=${this.fontFamily} @change=${(e: any) => {
                        this.fontFamily = e.target.value;
                        setTimeout(() => this.generateImage(), 100);
                         }}>
                         ${this.fontOptions.map(font => 
                            html`<option value="${font.name}">${font.name}</option>`
                        )}
                        </select>
                        <input type="range" class="range-input" min="12" max="120" .value=${this.fontSize.toString()} @input=${(e: any) => {
                            this.fontSize = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">Size: ${this.fontSize}px</div>
                    </div>

                    <div class="control-group">
                        <h4>Colors</h4>
                        <label>Text Color</label>
                        <input type="color" class="color-input" .value=${this.textColor} @input=${(e: any) => {
                            this.textColor = e.target.value;
                            this.generateImage();
                        }}>
                        <label>Background</label>
                        <input type="color" class="color-input" .value=${this.backgroundColor} @input=${(e: any) => {
                            this.backgroundColor = e.target.value;
                            this.generateImage();
                        }}>
                    </div>

                    <div class="control-group">
                        <h4>Stroke</h4>
                        <input type="range" class="range-input" min="0" max="10" .value=${this.strokeWidth.toString()} @input=${(e: any) => {
                            this.strokeWidth = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">Width: ${this.strokeWidth}px</div>
                        <input type="color" class="color-input" .value=${this.strokeColor} @input=${(e: any) => {
                            this.strokeColor = e.target.value;
                            this.generateImage();
                        }}>
                    </div>

                    <div class="control-group">
                        <h4>Shadow</h4>
                        <input type="range" class="range-input" min="0" max="20" .value=${this.shadowBlur.toString()} @input=${(e: any) => {
                            this.shadowBlur = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">Blur: ${this.shadowBlur}px</div>
                        <input type="color" class="color-input" .value=${this.shadowColor} @input=${(e: any) => {
                            this.shadowColor = e.target.value;
                            this.generateImage();
                        }}>
                        <input type="range" class="range-input" min="-20" max="20" .value=${this.shadowOffsetX.toString()} @input=${(e: any) => {
                            this.shadowOffsetX = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">X Offset: ${this.shadowOffsetX}px</div>
                        <input type="range" class="range-input" min="-20" max="20" .value=${this.shadowOffsetY.toString()} @input=${(e: any) => {
                            this.shadowOffsetY = parseInt(e.target.value);
                            this.generateImage();
                        }}>
                        <div class="value-display">Y Offset: ${this.shadowOffsetY}px</div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'stylish-text-generator': StylishTextGenerator;
    }
}