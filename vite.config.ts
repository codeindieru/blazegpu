import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BlazeGPU',
      fileName: 'blazegpu',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        format: 'umd'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
