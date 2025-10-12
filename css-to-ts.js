import fs from "fs";
import { globSync } from "glob";
import path from "path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import tailwindcssForm from "@tailwindcss/forms";
import cssnanoPlugin from "cssnano";

const cssFiles = globSync("./src/**/*.css");

cssFiles.forEach(cssFile => {
    transformCssToTs(cssFile);
});

export async function transformCssToTs(cssFile) {
    try {
        const fileName = path.parse(cssFile).name;
        const filenameWithoutExtension = path.parse(cssFile).name;
        let content = fs.readFileSync(cssFile);
        const variableName = `${fileName.replace(/-./g, val => val[1].toUpperCase())}Styles`;

        // tailwindcss and minify css
        content = await postcss([tailwindcss({
            config: {
                // must use same name for css and ts file and tool folder name for the component
                content: [`./src/${filenameWithoutExtension}/${filenameWithoutExtension}.ts`],
                plugins: [tailwindcssForm]
            }
        }), cssnanoPlugin]).process(content, { from: cssFile });

        // write .css.ts file
        fs.writeFileSync(`${cssFile}.ts`, `
// THIS IS AUTO GENERATED FILE, DO NOT MAKE ANY CHANGES HERE.
import { css } from 'lit';
const ${variableName} = css\`${content.toString('utf8')}\`;
export default ${variableName}`);
    } catch (err) {
        console.error(err);
    }
}
