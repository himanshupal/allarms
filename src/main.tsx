import { Hash, THEME_STORAGE_KEY } from '@/config'
import Stopwatch from '@/components/Stopwatch'
import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Timer from '@/components/Timer'
import Alarm from '@/components/Alarm'
import { Theme } from '@/types/Theme'

import '@/styles/main.scss'

const App = function () {
	const [hash, setHash] = useState<Hash>((window.location.hash as Hash) || '#/stopwatch')
	const [maximized, setMaximized] = useState<boolean>(false)
	const [theme, setTheme] = useState<Theme>(Theme.ONE)

	useEffect(() => {
		const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
		const themeToUse = savedTheme || String(theme)

		window.document.body.setAttribute(THEME_STORAGE_KEY, themeToUse)
		window.localStorage.setItem(THEME_STORAGE_KEY, themeToUse)
	}, [theme])

	const changeHash = () => setHash(window.location.hash as Hash)

	useEffect(() => {
		window.addEventListener('hashchange', changeHash)
		return () => window.removeEventListener('hashchange', changeHash)
	}, [])

	const Component = {
		'#/alarm': Alarm,
		'#/timer': Timer,
		'#/stopwatch': Stopwatch,
	}[hash]

	window.document.title = Component.name

	return (
		<Layout name={Component.name} hash={hash} maximized={maximized} setHash={setHash}>
			<Component maximized={maximized} setMaximized={setMaximized} />
		</Layout>
	)
}

const rootEl = document.getElementById('app')!
createRoot(rootEl).render(<App />)
