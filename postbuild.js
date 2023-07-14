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


// modify distributed package.json
const packagePath = resolve(outDir, 'package.json');
const packageJson = fs.readJsonSync(packagePath);
delete packageJson.scripts;
delete packageJson.devDependencies;
fs.writeJSONSync(packagePath, packageJson, {
    spaces: "\t"
});
