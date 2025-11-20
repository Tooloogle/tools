import { html, unsafeStatic } from 'lit/static-html.js';
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import path from 'path';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import { cwd } from 'process';

class ElementRenderer extends LitElementRenderer {
    connectedCallback() { }
}

const tempFolder = path.join(cwd(), `.tmp/tooloogle-tools-htmls`);

export async function renderAndStoreWebComponentHtmls() {
    if (!existsSync(tempFolder)) {
        mkdirSync(tempFolder, { recursive: true });
    }

    const tools = getToolList();
    for (const tool of tools) {
        try {
            const content = await renderWebComponent(tool);
            writeFileSync(path.join(tempFolder, `${tool}.txt`), content, `utf-8`);
        } catch (err) {
            console.log(`Error rendering tool ${tool}:`, err);
        }
    }
}

function getToolList() {
    const tools = readdirSync(path.join(cwd(), 'src')).filter((dir) => {
        const toolPath = path.join(cwd(), 'src', dir);
        return (existsSync(toolPath) && !dir.startsWith('_') && !dir.startsWith('.') && dir !== 'web-component');
    });

    return tools ?? [];
}

async function renderWebComponent(webComponent) {
    let content = '';
    try {
        await import(`../dist/cjs/${webComponent}/${webComponent}.js`);
        const result = render(
            html`<${unsafeStatic(webComponent)}></${unsafeStatic(webComponent)}>`,
            {
                elementRenderers: [ElementRenderer],
            },
        );
        content = await collectResult(result);
    } catch (err) {
        console.log(err);
    }

    return content
        .replace(`<${webComponent}>`, "<div>")
        .replace(`</${webComponent}>`, "</div>")
        .replaceAll(`<template shadowroot="open" shadowrootmode="open">`, "")
        .replaceAll("</template>", "");
}

renderAndStoreWebComponentHtmls();
