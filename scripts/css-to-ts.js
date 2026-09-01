import fs from "fs";
import { globSync } from "glob";
import path from "path";
import postcss from "postcss";
import tailwindcssPostcss from "@tailwindcss/postcss";
import cssnanoPlugin from "cssnano";

const cssFiles = globSync("./src/**/*.css");

/**
 * Shared @utility CSS files that are auto-injected into every tool's CSS
 * during build. These define tree-shakeable utility classes (btn, form-input,
 * etc.) — only the classes actually used in a tool's template are emitted.
 *
 * Add new shared @utility files here; they'll be available to all tools
 * without any manual @import in individual CSS files.
 */
const SHARED_UTILITY_IMPORTS = [
    'input.css',
    'button.css',
    'card.css',
];

cssFiles.forEach(cssFile => {
    transformCssToTs(cssFile);
});

/**
 * CSS files that only contain @utility definitions (fragment modules
 * imported by tool CSS files via CSS @import). They are NOT compiled
 * standalone — Tailwind tree-shakes them per-consumer instead.
 */
function isUtilityOnlyFile(content) {
    // Strip comments, then check if all remaining content is @utility blocks
    const stripped = content.toString().replace(/\/\*[\s\S]*?\*\//g, '').trim();
    return stripped.length > 0 && /^(\s*@utility\s+[\w-]+\s*\{[\s\S]*?\}\s*)+$/.test(stripped);
}

/**
 * Strip Tailwind's @property declarations, @layer properties fallback, and
 * known false-positive utility classes from the generated CSS string.
 * These are centralised in base.css (loaded once via WebComponentBase.styles)
 * so individual tool CSS files don't need to duplicate them.
 */
function stripTailwindOverhead(css) {
    // Remove @property --tw-*{…} blocks
    css = css.replace(/@property\s+--tw-[\w-]+\{[^}]+\}/g, '');

    // Remove @layer properties{…} block (nested braces)
    css = css.replace(/@layer properties\{@supports[^}]+\{[^}]+\{[^}]+\}\}\}/g, '');

    // Remove .static{position:static} false positive (from TS `static` keyword)
    css = css.replace(/\.static\{position:static\}/g, '');

    // Clean up any leftover double-semicolons or empty space
    css = css.replace(/;;+/g, ';');

    return css;
}

export async function transformCssToTs(cssFile) {
    try {
        const fileName = path.parse(cssFile).name;
        let content = fs.readFileSync(cssFile, 'utf8');

        // Skip @utility-only fragment files (they're auto-injected by the build)
        if (isUtilityOnlyFile(content)) {
            return;
        }

        const variableName = `${fileName.replace(/-./g, val => val[1].toUpperCase())}Styles`;

        // Get the directory of the CSS file for proper base path resolution
        const cssDir = path.dirname(cssFile);

        // Auto-prepend Tailwind boilerplate + shared @utility imports.
        // base.css uses its own directives (preflight + theme), so skip it.
        const isBaseFile = fileName === 'base';
        const isStylesDir = cssDir.includes('_styles');
        if (!isBaseFile) {
            // Strip any existing boilerplate the author may have left in the CSS
            content = content
                .replace(/^@reference\s+['"]tailwindcss\/theme['"];?\s*\n?/m, '')
                .replace(/^@import\s+['"]tailwindcss\/utilities['"];?\s*\n?/m, '');

            const preambleParts = ["@reference 'tailwindcss/theme';"];

            // These tools ship as Shadow-DOM web components. Consumers toggle dark
            // mode with a `.dark` class on an ancestor (<html>/<body>/wrapper), which
            // a plain `@media (prefers-color-scheme)` rule cannot observe. WebComponentBase
            // mirrors that theme onto the host as `.dark`, so map Tailwind's `dark:`
            // variant to `:host(.dark)` instead of the OS media query.
            preambleParts.push('@custom-variant dark (&:is(:host(.dark) *));');

            // Shared @utility imports only for tool CSS files (not _styles/ files
            // like grid.css, table.css, utils.css which are plain CSS)
            if (!isStylesDir) {
                const stylesRelPath = path.relative(cssDir, 'src/_styles').replace(/\\/g, '/');
                for (const f of SHARED_UTILITY_IMPORTS) {
                    preambleParts.push(`@import '${stylesRelPath}/${f}';`);
                }
            }

            preambleParts.push("@import 'tailwindcss/utilities';");
            content = preambleParts.join('\n') + '\n' + content;
        }

        // tailwindcss v4 and minify css
        content = await postcss([
            tailwindcssPostcss({
                // Base directory for content detection
                base: `./${cssDir}`,
                optimize: false // We use cssnano separately for minification
            }),
            cssnanoPlugin
        ]).process(content, { from: cssFile });

        let cssString = content.toString('utf8');

        // Strip @property / @layer properties / .static from all files except base.css
        // (base.css owns the centralised @property declarations)
        if (fileName !== 'base') {
            cssString = stripTailwindOverhead(cssString);
        }

        // Escape for safe embedding inside a JS template literal (lit `css`).
        // Tailwind emits escaped selectors like `.dark\:bg-gray-800` and
        // `.bg-green-900\/30`. Without escaping, the template literal collapses
        // `\:` → `:` (and `\/` → `/`, `\2014` → invalid), corrupting the selector
        // so the browser silently drops the rule — which breaks every `dark:`,
        // `hover:`, `sm:` … variant utility. Double the backslashes (and escape
        // backticks / `${`) so the runtime CSS keeps the required backslashes.
        const escapedCssString = cssString
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');

        // write .css.ts file
        fs.writeFileSync(`${cssFile}.ts`, `
// THIS IS AUTO GENERATED FILE, DO NOT MAKE ANY CHANGES HERE.
import { css } from 'lit';
const ${variableName} = css\`${escapedCssString}\`;
export default ${variableName}`);
    } catch (err) {
        console.error(err);
    }
}
