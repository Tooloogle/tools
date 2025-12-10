// vite.config.demo.js
import { defineConfig } from 'vite';
import { transformCssToTs } from './scripts/css-to-ts.js';
import path from 'path';
import { globSync } from 'glob';

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
            const srcDir = path.resolve('./src');
            
            cssFiles.forEach(cssFile => {
                const absolutePath = path.resolve(cssFile);
                server.watcher.add(absolutePath);
            });

            // Handle file changes
            server.watcher.on('change', async (file) => {
                // Check if the file is a CSS file within the src directory
                if (file.endsWith('.css')) {
                    const relativePath = path.relative(srcDir, file);
                    const isInSrcDir = !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
                    
                    if (isInSrcDir) {
                        console.log(`CSS file changed: ${file}`);
                        try {
                            await transformCssToTs(file);
                            console.log(`Successfully transformed: ${file} -> ${file}.ts`);
                            
                            // Trigger HMR for the corresponding .css.ts file
                            const tsFile = `${file}.ts`;
                            const module = server.moduleGraph.getModuleById(tsFile);
                            if (module) {
                                server.moduleGraph.invalidateModule(module);
                                server.ws.send({
                                    type: 'update',
                                    updates: [{
                                        type: 'js-update',
                                        path: tsFile,
                                        acceptedPath: tsFile,
                                        timestamp: Date.now()
                                    }]
                                });
                            }
                        } catch (error) {
                            console.error(`Error transforming CSS: ${file}`, error);
                        }
                    }
                }
            });
        },
        handleHotUpdate({ file }) {
            // This handles CSS files within the demo directory
            if (file.endsWith('.css')) {
                const srcDir = path.resolve('./src');
                const relativePath = path.relative(srcDir, file);
                const isInSrcDir = !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
                
                // Only transform if NOT in src directory (src is handled by configureServer)
                if (!isInSrcDir) {
                    transformCssToTs(file);
                }
            }
        }
    }]
});
