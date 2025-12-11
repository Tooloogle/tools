import { defineConfig } from 'vite';
import { transformCssToTs } from './scripts/css-to-ts.js';
import path from 'path';
import { globSync } from 'glob';

function isInSrcDirectory(file) {
    const srcDir = path.resolve('./src');
    const relativePath = path.relative(srcDir, file);
    return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

export default defineConfig({
    root: 'demo',
    build: {
        outDir: '../dist-demo',
    },
    plugins: [{
        name: 'css-to-ts',
        configureServer(server) {
            // Watch CSS files in the src directory (which is outside the vite root)
            const cssFiles = globSync('./src/**/*.css');

            cssFiles.forEach(cssFile => {
                const absolutePath = path.resolve(cssFile);
                server.watcher.add(absolutePath);
            });

            // Handle file changes
            server.watcher.on('change', async (file) => {

                // Check if the file is a CSS file within the src directory
                if (file.endsWith('.css') && isInSrcDirectory(file)) {
                    try {
                        await transformCssToTs(file);
                        server.config.logger.info(`Transformed CSS to TS: ${file}`, { timestamp: true });
                    } catch (error) {
                        server.config.logger.error(`Error transforming CSS: ${file}`, error);
                    }
                }
            });
        }
    }]
});
