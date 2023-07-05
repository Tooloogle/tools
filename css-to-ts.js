import fs from "fs";
import { globSync } from "glob";
import path from "path";

const cssFiles = globSync("./src/**/*.css");

cssFiles.forEach(cssFile => {
    try {
        const fileName = path.parse(cssFile).name;
        const content = fs.readFileSync(cssFile);
        fs.writeFileSync(`${cssFile}.ts`, `
// THIS IS AUTO GENERATED FILE, DO NOT MAKE ANY CHANGES HERE.
import { css } from 'lit';
export const ${fileName.replace(/-./g, val => val[1].toUpperCase())}Styles = css\`${content.toString('utf8')}\`;`);
    } catch (err) {
        console.error(err);
    }
});
