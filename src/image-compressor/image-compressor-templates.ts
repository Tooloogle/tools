import { html, type TemplateResult } from 'lit';
import type { ImageCompressor } from './image-compressor.js';
import { formatBytes } from './image-compressor-utils.js';

export function renderModeToggle(host: ImageCompressor): TemplateResult {
    return html`
        <div class="mode-toggle">
            <label>
                <input type="radio" name="cmode" value="quality"
                    .checked=${host.mode === 'quality'} @change=${host.onModeChange} />
                Quality
            </label>
            <label>
                <input type="radio" name="cmode" value="targetSize"
                    .checked=${host.mode === 'targetSize'} @change=${host.onModeChange} />
                Target size
            </label>
        </div>
    `;
}

export function renderFormatSelect(host: ImageCompressor): TemplateResult {
    return html`
        <label class="block">
            <span class="block py-1 text-sm">Output format</span>
            <select class="form-input" .value=${host.outputFormat} @change=${host.onFormatChange}>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
            </select>
        </label>
    `;
}

export function renderQualityControl(host: ImageCompressor): TemplateResult {
    return html`
        <label class="block">
            <span class="block py-1 text-sm">Quality: ${host.quality.toFixed(2)}</span>
            <div class="quality-row">
                <input type="range" min="0.1" max="1" step="0.05"
                    .value=${String(host.quality)} @input=${host.onQualityInput} />
                <span class="quality-value">${host.quality.toFixed(2)}</span>
            </div>
        </label>
    `;
}

export function renderTargetSizeControl(host: ImageCompressor): TemplateResult {
    return html`
        <label class="block">
            <span class="block py-1 text-sm">Max size (KB)</span>
            <input class="form-input" type="number" min="1"
                .value=${String(host.targetSizeKB)} @input=${host.onTargetSizeInput} />
        </label>
        <button class="btn btn-blue" @click=${host.compress} ?disabled=${host.busy}>
            ${host.busy ? 'Compressing…' : 'Compress to target size'}
        </button>
    `;
}

export function renderStats(host: ImageCompressor): TemplateResult {
    return html`
        <div class="stat-row">
            <div class="stat-card">
                <span class="label">Original</span>
                <span class="value">${formatBytes(host.originalSize)}</span>
            </div>
            <div class="stat-card">
                <span class="label">Compressed</span>
                <span class="value">${formatBytes(host.outputSize)}</span>
            </div>
            <div class="stat-card savings">
                <span class="label">Saved</span>
                <span class="value">${host.savingsPercent.toFixed(1)}%</span>
            </div>
        </div>
        ${host.mode === 'targetSize' ? html`
            <div class="text-xs text-slate-500">
                Quality used: ${host.effectiveQuality.toFixed(2)}
            </div>
        ` : null}
        <div>
            <a class="btn btn-green" href=${host.outputBlobUrl} download=${host.downloadFileName}>
                Download
            </a>
        </div>
    `;
}
