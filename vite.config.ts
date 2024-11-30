import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@web3modal/ethereum', '@web3modal/react'],
  },
  define: {
    global: 'globalThis',
  },
})