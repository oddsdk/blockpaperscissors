import { resolve } from 'path'
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: true,
    target: 'es2020'
  },
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $contracts: resolve('./src/contracts'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src')
    }
  },
  server: {
    port: 5178,
    strictPort: false
  }
}

export default config;
