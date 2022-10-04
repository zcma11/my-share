import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const _resolve = (name: string) => {
  return path.resolve(__dirname, name)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{alias: [
    {
      find: /^api/,
      replacement: _resolve('src/api')
    }
  ]}
})
