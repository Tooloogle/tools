// vite.config.demo.js
import { defineConfig } from 'vite';
import { transformCssToTs } from './scripts/css-to-ts.js';

export default defineConfig({
    root: 'demo',
    build: {
        outDir: '../dist-demo',
    },
    plugins: [{
        name: 'css-to-ts',
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.css')) {
                transformCssToTs(file);
            }
        }
    }]
});
