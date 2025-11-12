import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Garante caminhos corretos na raiz do dominio
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})