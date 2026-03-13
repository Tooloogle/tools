import { resolve } from 'path';
import fs from 'fs-extra';

const outDir = 'dist';

// copy required package files
[
    'package.json',
    'LICENSE',
    'README.md',
].forEach(fileOrDir => {
    fs.copySync(
        resolve(fileOrDir),
        resolve(outDir, fileOrDir)
    );
});

// copy SSR files (plain JS, not compiled by tsc)
fs.copySync(
    resolve("scripts/render-to-html.js"),
    resolve(outDir, "ssr/render-to-html.js")
);
fs.copySync(
    resolve("scripts/ssr-cli.js"),
    resolve(outDir, "ssr/cli.js")
);

// modify distributed package.json
const packagePath = resolve(outDir, 'package.json');
const packageJson = fs.readJsonSync(packagePath);
delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.release;
fs.writeJSONSync(packagePath, packageJson, {
    spaces: "\t"
});
