import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Watch the library's dist folder (symlinked in node_modules)
      ignored: ['!**/node_modules/@savvycal/mjml-editor/dist/**'],
    },
  },
  optimizeDeps: {
    // Don't pre-bundle the library so changes are picked up
    exclude: ['@savvycal/mjml-editor'],
  },
})
