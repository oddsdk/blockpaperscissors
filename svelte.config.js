import preprocess from 'svelte-preprocess'
import preprocessReact from 'svelte-preprocess-react/preprocessReact'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocessReact({
    preprocess: preprocess({
      postcss: true
    })
  }),
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    })
  }
}

export default config
