import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { resolve } from 'path'

const basePath = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': basePath,
		},
	},
	build:{
		manifest:true,
	},
	css: {
		preprocessorOptions: {
			scss: { additionalData: `@import "${basePath}/styles/variables.scss";\n` },
		},
	},
})
