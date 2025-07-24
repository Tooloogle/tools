import { html, TemplateResult } from 'lit';
import { OptimizationOptions } from './svg-optimizer-utils.js';

export class SvgOptimizerTemplates {
    static renderUploadSection(
        originalSvg: string,
        handleFileUpload: (e: Event) => void,
        handleSvgTextInput: (e: Event) => void
    ): TemplateResult {
        return html`
            <div class="input-section">
                <label class="upload-label">Upload SVG File</label>
                <div class="upload-area">
                    <input 
                        type="file" 
                        accept=".svg,image/svg+xml" 
                        class="form-input" 
                        @change="${handleFileUpload}"
                    />
                </div>
                <div class="text-input-area">
                    <label>Or paste SVG code:</label>
                    <textarea 
                        class="form-input svg-textarea" 
                        placeholder="Paste your SVG code here..."
                        @input="${handleSvgTextInput}"
                        .value="${originalSvg}"
                    ></textarea>
                </div>
            </div>
        `;
    }

    static renderErrorMessage(error: string): TemplateResult {
        return error ? html`<div class="error-message">${error}</div>` : html``;
    }

    static renderActionSection(
        originalSvg: string,
        optimizing: boolean,
        optimizeSvg: () => void
    ): TemplateResult {
        return html`
            <div class="action-section">
                <button 
                    class="btn btn-blue" 
                    @click="${optimizeSvg}" 
                    ?disabled="${!originalSvg || optimizing}"
                >
                    ${optimizing ? 'Optimizing...' : 'Optimize SVG'}
                </button>
            </div>
        `;
    }

    static renderStatsSection(
        originalSize: number,
        optimizedSize: number,
        formatBytes: (bytes: number) => string,
        getSavingsPercentage: () => number
    ): TemplateResult {
        if (originalSize === 0) return html``;

        return html`
            <div class="stats-section">
                <div class="stat">
                    <span class="label">Original Size:</span>
                    <span class="value">${formatBytes(originalSize)}</span>
                </div>
                ${optimizedSize > 0 ? html`
                    <div class="stat">
                        <span class="label">Optimized Size:</span>
                        <span class="value">${formatBytes(optimizedSize)}</span>
                    </div>
                    <div class="stat savings">
                        <span class="label">Savings:</span>
                        <span class="value">
                            ${formatBytes(originalSize - optimizedSize)} 
                            (${getSavingsPercentage()}%)
                        </span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static renderResultSection(
        optimizedSvg: string,
        originalSvg: string,
        downloadOptimized: () => void,
        copyOptimized: () => void
    ): TemplateResult {
        if (!optimizedSvg) return html``;

        return html`
            <div class="result-section">
                <div class="result-actions">
                    <button class="btn btn-green" @click="${downloadOptimized}">
                        Download Optimized
                    </button>
                    <button class="btn btn-blue" @click="${copyOptimized}">
                        Copy Code
                    </button>
                </div>
                <div class="svg-comparison">
                    <div class="svg-preview">
                        <h4>Original</h4>
                        <div class="svg-container" .innerHTML="${originalSvg}"></div>
                    </div>
                    <div class="svg-preview">
                        <h4>Optimized</h4>
                        <div class="svg-container" .innerHTML="${optimizedSvg}"></div>
                    </div>
                </div>
                <div class="code-output">
                    <label>Optimized SVG Code:</label>
                    <textarea 
                        class="form-input svg-textarea" 
                        readonly
                        .value="${optimizedSvg}"
                    ></textarea>
                </div>
            </div>
        `;
    }

    static renderOptionsSection(
        options: OptimizationOptions,
        handleOptionChange: (e: Event) => void
    ): TemplateResult {
        const optionConfigs = [
            { key: 'removeViewBox', label: 'Remove viewBox' },
            { key: 'removeTitle', label: 'Remove title elements' },
            { key: 'removeDesc', label: 'Remove desc elements' },
            { key: 'removeComments', label: 'Remove comments' },
            { key: 'removeMetadata', label: 'Remove metadata' },
            { key: 'removeUselessStrokeAndFill', label: 'Remove useless stroke/fill' },
            { key: 'cleanupIds', label: 'Cleanup unused IDs' },
            { key: 'minifyStyles', label: 'Minify styles' },
            { key: 'convertStyleToAttrs', label: 'Convert styles to attributes' },
            { key: 'removeUnusedNS', label: 'Remove unused namespaces' },
            { key: 'cleanupNumericValues', label: 'Cleanup numeric values' },
            { key: 'collapseGroups', label: 'Collapse empty groups' }
        ];

        const optionCheckboxes = optionConfigs.map(({ key, label }) =>
            this.renderOptionCheckbox(
                key as keyof OptimizationOptions,
                label,
                options,
                handleOptionChange
            )
        );

        return html`
        <div class="options-section">
            <h3>Optimization Options:</h3>
            <div class="options-grid">
                ${optionCheckboxes}
            </div>
        </div>
    `;
    }

    static renderOptionCheckbox(
        optionName: keyof OptimizationOptions,
        label: string,
        options: OptimizationOptions,
        handleOptionChange: (e: Event) => void
    ): TemplateResult {
        return html`
            <label>
                <input 
                    type="checkbox" 
                    name="${optionName}" 
                    ?checked="${options[optionName]}" 
                    @change="${handleOptionChange}"
                >
                ${label}
            </label>
        `;
    }

    static renderNotes(): TemplateResult {
        return html`
            <ul class="note">
                <li>Optimizes SVG files by removing unnecessary elements and attributes</li>
                <li>Preserves visual appearance while reducing file size</li>
                <li>All optimization happens in your browser - no files uploaded</li>
                <li>Preview both original and optimized versions side by side</li>
                <li><strong>Conservative defaults:</strong> Color-affecting options are disabled by default</li>
            </ul>
        `;
    }
}