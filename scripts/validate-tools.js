// Validates that demo/tools.js stays in sync with src/ tool folders:
//   1. The array is alphabetically sorted.
//   2. Every entry has a matching src/<name>/ folder.
//   3. Every src/<name>/ folder (excluding _* internals and t-* shared components)
//      is listed in the array.
// Exits with a non-zero status code on failure so CI catches drift.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const demoFile = path.join(root, 'demo', 'tools.js');
const srcDir = path.join(root, 'src');

const { default: tools } = await import(`file:///${demoFile.replace(/\\/g, '/')}`);

const errors = [];

// 1. sorted
const sorted = [...tools].sort((a, b) => a.localeCompare(b));
for (let i = 0; i < tools.length; i++) {
    if (tools[i] !== sorted[i]) {
        errors.push(`demo/tools.js is not alphabetically sorted (first mismatch at index ${i}: "${tools[i]}" should be "${sorted[i]}")`);
        break;
    }
}

// 2 + 3. cross-check with src/ folders
const folders = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(n => !n.startsWith('_') && !n.startsWith('t-'));

const folderSet = new Set(folders);
const toolSet = new Set(tools);

for (const t of tools) {
    if (!folderSet.has(t)) {
        errors.push(`demo/tools.js lists "${t}" but src/${t}/ does not exist`);
    }
}
for (const f of folders) {
    if (!toolSet.has(f)) {
        errors.push(`src/${f}/ exists but is not listed in demo/tools.js`);
    }
}

if (errors.length) {
    console.error('validate-tools failed:');
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
}

console.log(`validate-tools OK (${tools.length} tools, all sorted and in sync)`);
