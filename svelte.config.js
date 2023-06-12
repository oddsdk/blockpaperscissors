import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: true
  }),
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    prerender: {
      // use relative URLs similar to an anchor tag <a href="/test/1"></a>
      // do not include group layout folders in the path such as /(group)/test/1
      entries: [
        '*',
        '/filecoin/connect',
        '/filecoin/help',
        '/filecoin/intro',
        '/filecoin/leaderboard',
        '/filecoin/monitor',
        '/filecoin/play',
        '/filecoin/profile',
        '/filecoin/vote',
        '/ethereum/connect',
        '/ethereum/help',
        '/ethereum/intro',
        '/ethereum/leaderboard',
        '/ethereum/monitor',
        '/ethereum/play',
        '/ethereum/profile',
        '/ethereum/vote',
        '/polygon/connect',
        '/polygon/help',
        '/polygon/intro',
        '/polygon/leaderboard',
        '/polygon/monitor',
        '/polygon/play',
        '/polygon/profile',
        '/polygon/vote'
      ],
      handleHttpError: ({ path, referrer, message }) => {
        // ignore deliberate link to shiny 404 page
        console.log('path', path)
        console.log('referrer', referrer)
        if (
          path.includes('/TODO')
        ) {
          return
        }

        // otherwise fail the build
        throw new Error(message)
      }
    }
  }
}

export default config
