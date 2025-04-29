import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'BlazeGPU',
      fileName: 'blazegpu'
    },
    rollupOptions: {
      external: [],
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
