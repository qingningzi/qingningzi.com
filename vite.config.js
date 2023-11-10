const {resolve} = require('path')
import { defineConfig, loadEnv } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from 'tailwindcss'

export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())}
    const isDev = process.env.VITE_APP_ENV !== 'production'

    return defineConfig({
        base: isDev ? '.' : 'https://cdn.qingningzi.com/build/',
        build: {
            outDir: resolve(__dirname, 'public/build'),
            emptyOutDir: true,
            manifest: true,
            target: 'es2018',
        },
        css: {
            extract: true,
            preprocessorOptions: {
                scss: {}
            },
            postcss: {
                plugins: [tailwindcss]
            }
        },
        plugins: [
            laravel({
                input: ['resources/scss/app.scss', 'resources/scss/dashboard.scss', 'resources/js/app.js', 'resources/js/dashboard.js'],
                refresh: true,
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'resources'),
            }
        },
        optimizeDeps: {
            include: [
                'bootstrap',
                'feather-icons',
                'smooth-scroll',
                'axios',
                'alpinejs',
                'sentry',
            ]
        }
    })
}
