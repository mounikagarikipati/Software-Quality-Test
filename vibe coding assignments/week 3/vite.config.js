import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build'
    ? '/Software-Quality-Test/vibe coding assignments/week 3/'
    : '/',
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  }
}))
