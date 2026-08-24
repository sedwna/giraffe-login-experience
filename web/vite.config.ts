import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/giraffe-login-experience/',
  build: {
    // The default CSS minifier deduplicates `backdrop-filter` against its
    // -webkit- prefixed twin and drops the standard property, which kills
    // the frosted-glass effect in production. The stylesheet is ~21KB, so
    // shipping it unminified costs almost nothing after gzip.
    cssMinify: false,
  },
})
