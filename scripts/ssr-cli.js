#!/usr/bin/env node

/**
 * CLI wrapper for @tooloogle/tools SSR renderer.
 *
 * Usage:
 *   node scripts/ssr-cli.js
 *   node scripts/ssr-cli.js --outDir ./ssr-output
 *   node scripts/ssr-cli.js --outDir ./ssr-output --distDir ./node_modules/@tooloogle/tools
 *   node scripts/ssr-cli.js --outDir ./ssr-output --tools age-calculator,guid-generator
 */

import { renderToolsToHtml } from './render-to-html.js';

function parseArgs(argv) {
    const args = {};
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--outDir' && argv[i + 1]) {
            args.outDir = argv[++i];
        } else if (arg === '--distDir' && argv[i + 1]) {
            args.distDir = argv[++i];
        } else if (arg === '--tools' && argv[i + 1]) {
            args.tools = argv[++i].split(',').map(t => t.trim());
        } else if (arg === '--help' || arg === '-h') {
            console.log(`
Usage: node scripts/ssr-cli.js [options]

Options:
  --outDir <path>    Output directory for rendered HTML files
                     (default: .tmp/tooloogle-tools-htmls)
  --distDir <path>   Path to @tooloogle/tools dist directory
                     (default: auto-detected)
  --tools <list>     Comma-separated list of tools to render
                     (default: all tools)
  -h, --help         Show this help
`);
            process.exit(0);
        }
    }
    return args;
}

const args = parseArgs(process.argv);
const { errors } = await renderToolsToHtml(args);
process.exit(errors.length > 0 ? 1 : 0);
