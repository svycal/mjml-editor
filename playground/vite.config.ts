import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const libRoot = path.resolve(__dirname, '../packages/mjml-editor');

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: isDev
        ? {
            // Library's internal path alias (must come first)
            '@': path.resolve(libRoot, 'src'),
            // Redirect library imports to source
            '@savvycal/mjml-editor/styles.css': path.resolve(
              libRoot,
              'src/index.css'
            ),
            '@savvycal/mjml-editor': path.resolve(libRoot, 'src/index.ts'),
          }
        : {},
    },
    ...(!isDev && {
      optimizeDeps: {
        exclude: ['@savvycal/mjml-editor'],
      },
    }),
  };
});
