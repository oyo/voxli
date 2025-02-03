import { defineConfig } from 'vite'

export default defineConfig({
  base: '/voxli/',
  plugins: [],
  build: {
    copyPublicDir: true,
    outDir: './build',
    rollupOptions: {},
  },
})
