import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import injectEnv from '../plugins/vite-plugin-inject-env.js'
import path from 'path'

const _resolve = name => {
  return path.resolve(__dirname, name)
}

// https://vitejs.dev/config/
export default defineConfig({
  root: _resolve('.'),
  plugins: [vue(), injectEnv()],
  resolve: {
    alias: [
      {
        find: /^api/,
        replacement: _resolve('src/api')
      }
    ]
  },

  build: {
    //   watch: _resolve('.')
    sourcemap: true
  }
})
