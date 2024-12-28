import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const basePath = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': basePath,
		},
	},
	build: {
		manifest: true,
	},
})
