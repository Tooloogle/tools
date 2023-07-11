import fs from "fs";
import { globSync } from "glob";
import path from "path";

const cssFiles = globSync("./src/**/*.css");

cssFiles.forEach(cssFile => {
    try {
        const fileName = path.parse(cssFile).name;
        const content = fs.readFileSync(cssFile);
        const variableName = `${fileName.replace(/-./g, val => val[1].toUpperCase())}Styles`;
        fs.writeFileSync(`${cssFile}.ts`, `
// THIS IS AUTO GENERATED FILE, DO NOT MAKE ANY CHANGES HERE.
import { css } from 'lit';
const ${variableName} = css\`${content.toString('utf8')}\`;
export default ${variableName}`);
    } catch (err) {
        console.error(err);
    }
});
