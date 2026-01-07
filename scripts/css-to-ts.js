import fs from "fs";
import { globSync } from "glob";
import path from "path";
import postcss from "postcss";
import tailwindcssPostcss from "@tailwindcss/postcss";
import cssnanoPlugin from "cssnano";

const cssFiles = globSync("./src/**/*.css");

// Skip theme.css - it will be imported by individual tool CSS files
const filesToSkip = ['theme.css'];

cssFiles.forEach(cssFile => {
    const fileName = path.parse(cssFile).base;
    if (filesToSkip.includes(fileName)) {
        console.log(`Skipping ${cssFile} (will be imported by tool CSS files)`);
        return;
    }
    transformCssToTs(cssFile);
});

export async function transformCssToTs(cssFile) {
    try {
        const fileName = path.parse(cssFile).name;
        const filenameWithoutExtension = path.parse(cssFile).name;
        let content = fs.readFileSync(cssFile);
        const variableName = `${fileName.replace(/-./g, val => val[1].toUpperCase())}Styles`;

        // Get the directory of the CSS file for proper base path resolution
        const cssDir = path.dirname(cssFile);

        // tailwindcss v4 and minify css
        content = await postcss([
            tailwindcssPostcss({
                // Base directory for content detection
                base: `./${cssDir}`,
                optimize: false // We use cssnano separately for minification
            }),
            cssnanoPlugin
        ]).process(content, { from: cssFile });

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
