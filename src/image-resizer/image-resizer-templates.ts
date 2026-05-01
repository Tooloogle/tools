import { html, type TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import type { ImageResizer } from './image-resizer.js';

export function renderModeToggle(host: ImageResizer): TemplateResult {
    return html`
        <div class="mode-toggle">
            <label>
                <input type="radio" name="mode" value="pixels"
                    .checked=${host.mode === 'pixels'} @change=${host.onModeChange} />
                Pixels
            </label>
            <label>
                <input type="radio" name="mode" value="percent"
                    .checked=${host.mode === 'percent'} @change=${host.onModeChange} />
                Percent
            </label>
        </div>
    `;
}

export function renderPixelInputs(host: ImageResizer): TemplateResult {
    return html`
        <div class="dim-row">
            <label class="dim-field block">
                <span class="block py-1 text-sm">Width (px)</span>
                <input class="form-input" type="number" min="1"
                    .value=${String(host.targetWidth)} @input=${host.onWidthInput} />
            </label>
            <label class="dim-field block">
                <span class="block py-1 text-sm">Height (px)</span>
                <input class="form-input" type="number" min="1"
                    .value=${String(host.targetHeight)} @input=${host.onHeightInput} />
            </label>
            <label class="block text-sm">
                <input type="checkbox" .checked=${host.lockAspect} @change=${host.onLockToggle} />
                Lock aspect ratio
            </label>
        </div>
        <div class="text-xs text-slate-500">
            Original: ${host.originalWidth} &times; ${host.originalHeight} px
        </div>
    `;
}

export function renderPercentInput(host: ImageResizer): TemplateResult {
    return html`
        <label class="block">
            <span class="block py-1 text-sm">Scale (%)</span>
            <input class="form-input" type="number" min="1" max=${host.maxScalePercent}
                .value=${String(host.scalePercent)} @input=${host.onPercentInput} />
            <span class="mt-1 block text-xs text-slate-500">
                Output: ${Math.round((host.originalWidth * host.scalePercent) / 100)}
                &times; ${Math.round((host.originalHeight * host.scalePercent) / 100)} px
            </span>
        </label>
    `;
}

export function renderFormatRow(host: ImageResizer): TemplateResult {
    const showQuality = host.outputFormat !== 'image/png';
    return html`
        <div class="dim-row">
            <label class="block">
                <span class="block py-1 text-sm">Output format</span>
                <select class="form-input" .value=${host.outputFormat} @change=${host.onFormatChange}>
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/webp">WebP</option>
                </select>
            </label>
            ${when(showQuality, () => html`
                <label class="block flex-1">
                    <span class="block py-1 text-sm">Quality: ${host.quality.toFixed(2)}</span>
                    <input type="range" min="0.1" max="1" step="0.05"
                        .value=${String(host.quality)} @input=${host.onQualityChange} />
                </label>
            `)}
        </div>
    `;
}
