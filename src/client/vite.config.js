import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import injectEnv from '../plugins/vite-plugin-inject-env.js'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const _resolve = name => {
  return path.resolve(__dirname, name)
}

// https://vitejs.dev/config/
export default defineConfig({
  root: _resolve('.'),
  plugins: [
    vue(),
    injectEnv(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
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
