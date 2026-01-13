import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import { readFileSync } from 'fs';

const isWatch = process.argv.includes('--watch');

// Read package.json to get dependencies for externalization
const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
);
const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Skip dts in watch mode to avoid incremental build errors
    !isWatch &&
      dts({
        insertTypesEntry: true,
        // Don't roll up types - keep them as separate files to match preserveModules
        rollupTypes: false,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        styles: path.resolve(__dirname, 'src/styles.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Externalize all dependencies - they should be installed by consumers
      external: (id) => {
        // Always externalize react
        if (
          id === 'react' ||
          id === 'react-dom' ||
          id === 'react/jsx-runtime'
        ) {
          return true;
        }
        // Externalize all dependencies and their subpaths
        return externalDeps.some(
          (dep) => id === dep || id.startsWith(`${dep}/`)
        );
      },
      output: {
        // Preserve module structure for tree-shaking
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'styles.css';
          return assetInfo.name || '';
        },
      },
    },
    cssCodeSplit: false,
  },
});
