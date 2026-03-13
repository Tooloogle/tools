/**
 * @tooloogle/tools SSR helper
 *
 * Renders all @tooloogle web components to static HTML files
 * that can be used as placeholder content before hydration.
 *
 * Usage (programmatic):
 *   import { renderToolsToHtml } from '@tooloogle/tools/ssr/render-to-html.js';
 *   await renderToolsToHtml({ outDir: './ssr-output', distDir: './node_modules/@tooloogle/tools' });
 *
 * Usage (CLI):
 *   npx tooloogle-ssr --outDir ./ssr-output
 */

import { html, unsafeStatic } from 'lit/static-html.js';
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';

class ElementRenderer extends LitElementRenderer {
    connectedCallback() { }
}

/**
 * Get the list of available tool names from the dist directory.
 * @param {string} distDir - Path to the @tooloogle/tools dist directory
 * @returns {string[]} Array of tool directory names
 */
export function getToolList(distDir) {
    return readdirSync(distDir).filter((dir) => {
        const toolPath = path.join(distDir, dir);
        return existsSync(toolPath) && !dir.startsWith('_') && !dir.startsWith('.') && dir !== 'ssr';
    });
}

/**
 * Render a single web component to static HTML.
 * @param {string} webComponent - The custom element tag name
 * @param {string} distDir - Path to the @tooloogle/tools dist directory
 * @returns {Promise<string>} The rendered HTML string
 */
export async function renderWebComponent(webComponent, distDir) {
    let content = '';
    try {
        await import(pathToFileURL(path.resolve(distDir, webComponent, `${webComponent}.js`)).href);
        const result = render(
            html`<${unsafeStatic(webComponent)}></${unsafeStatic(webComponent)}>`,
            {
                elementRenderers: [ElementRenderer],
            },
        );
        content = await collectResult(result);
    } catch (err) {
        console.error(`Error rendering <${webComponent}>:`, err);
    }

    return content
        .replace(`<${webComponent}>`, '<div>')
        .replace(`</${webComponent}>`, '</div>')
        .replaceAll('<template shadowroot="open" shadowrootmode="open">', '')
        .replaceAll('</template>', '');
}

/**
 * Render all @tooloogle web components to static HTML files.
 *
 * @param {Object} options
 * @param {string}  options.outDir  - Output directory for the rendered HTML files (default: `.tmp/tooloogle-tools-htmls`)
 * @param {string} [options.distDir] - Path to the @tooloogle/tools dist directory
 *                                     (default: tries to resolve from the package itself)
 * @param {string[]} [options.tools] - Specific tools to render. If omitted, renders all.
 * @returns {Promise<{ rendered: string[], errors: string[] }>}
 */
export async function renderToolsToHtml(options = {}) {
    const {
        outDir = '.tmp/tooloogle-tools-htmls',
        distDir = guessDistDir(),
        tools,
    } = options;

    const outPath = path.resolve(outDir);
    if (!existsSync(outPath)) {
        mkdirSync(outPath, { recursive: true });
    }

    const toolList = tools ?? getToolList(distDir);
    const rendered = [];
    const errors = [];

    for (const tool of toolList) {
        try {
            const content = await renderWebComponent(tool, distDir);
            writeFileSync(path.join(outPath, `${tool}.txt`), content, 'utf-8');
            rendered.push(tool);
        } catch (err) {
            console.error(`Error rendering tool ${tool}:`, err);
            errors.push(tool);
        }
    }

    console.log(`SSR: rendered ${rendered.length} tools to ${outPath}`);
    if (errors.length) {
        console.warn(`SSR: ${errors.length} tools failed: ${errors.join(', ')}`);
    }

    return { rendered, errors };
}

/**
 * Try to find the dist directory relative to this file's location.
 * Works both when running from source (src/ssr/) and from the installed package (ssr/).
 */
function guessDistDir() {
    const thisDir = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
    const parentDir = path.resolve(thisDir, '..');

    // Running from source repo: this file is at <repo>/scripts/render-to-html.js
    // Built output lives at <repo>/dist/
    const fromSource = path.join(parentDir, 'dist');
    if (existsSync(fromSource)) return fromSource;

    // Installed package: this file is at <pkg>/ssr/render-to-html.js
    // Tool dirs are siblings at <pkg>/age-calculator/ etc.
    return parentDir;
}
