import path from "path";
import fs from "fs-extra";
import { cwd } from "process";
import demoListJson from "./demo/tools.js";

const args = process.argv.slice(2)
if (!args.length) {
    console.error("Please run command with tool name args. e.g. npm run new -- new-tool-name-in-kebab-case")
    process.exit(1);
}

const tool = args[0];
const toolCamelcase = tool.replace(/(-)([a-z])/g, v => v.toUpperCase()).replace(/-/g, "");

const folder = path.join(cwd(), "src", tool);
const demoFolder = path.join(cwd(), "demo");

fs.mkdirSync(folder)

const cssContent = `@tailwind components;
@tailwind utilities;`

const tsContent = `import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import ${toolCamelcase}Styles from './${tool}.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('${tool}')
export class ${capitalize(toolCamelcase)} extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, ${toolCamelcase}Styles];

    override render() {
        return html\`
            <h2>
                ${tool}
            </h2>
            Start updating the new tool
        \`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        '${tool}': ${capitalize(toolCamelcase)};
    }
}
`;

const indexTsContent = `export * from './${tool}.js';\n`;

fs.writeFileSync(path.join(demoFolder, `tools.js`), `const tools = ${JSON.stringify([...demoListJson, tool], null, 4)};

if (typeof window !== "undefined") {
    window.tools = tools;
}

export default tools;
`);
fs.writeFileSync(path.join(folder, `${tool}.css`), cssContent);
fs.writeFileSync(path.join(folder, `${tool}.ts`), tsContent);
fs.writeFileSync(path.join(folder, `index.ts`), indexTsContent);

console.log("Done!");

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}
