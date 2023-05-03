import { resolve } from 'path'
import { sveltekit } from '@sveltejs/kit/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: true,
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['ethers'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        })
      ]
    }
  },
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $contracts: resolve('./src/contracts'),
      $root: resolve('./'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src')
    }
  },
  server: {
    port: 5178,
    strictPort: false
  }
}

export default config
