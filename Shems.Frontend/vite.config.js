import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // This tells Sass to ignore warnings from node_modules
        quietDeps: true 
      }
    }
  }
})
