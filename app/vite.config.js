import { defineConfig } from 'vite'

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/assets/styles/_variables.scss";`,
            },
        },
    },
    build: {
        cssCodeSplit: true,
    },
    server: {
        host: true,
        port: 3000
    }
})