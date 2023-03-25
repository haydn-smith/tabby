import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginRadar({
      enableDev: true,
      analytics: {
        id: 'G-6BT0P40NLF',
      },
    })
  ],
  base: '/tabby/',
})
