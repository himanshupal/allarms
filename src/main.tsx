import { useEffect, useMemo, useState } from 'react'
import { Hash, THEME_STORAGE_KEY } from '@/config'
import Stopwatch from '@/components/Stopwatch'
import { createRoot } from 'react-dom/client'
import Layout from '@/components/Layout'
import Timer from '@/components/Timer'
import Alarm from '@/components/Alarm'
import { Theme } from '@/types/Theme'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import objectSupport from 'dayjs/plugin/objectSupport'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

import '@/styles/main.scss'

const App = function () {
	const [hash, setHash] = useState<Hash>((window.location.hash as Hash) || '#/stopwatch')
	const [maximized, setMaximized] = useState<boolean>(false)
	const [theme, setTheme] = useState<Theme>(Theme.ONE)

	const name = useMemo(
		() =>
			({
				'#/alarm': 'Alarm',
				'#/timer': 'Timer',
				'#/stopwatch': 'Stopwatch',
			}[hash]),
		[hash]
	)

	useEffect(() => {
		const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
		const themeToUse = savedTheme || String(theme)

		window.document.body.setAttribute(THEME_STORAGE_KEY, themeToUse)
		window.localStorage.setItem(THEME_STORAGE_KEY, themeToUse)
	}, [theme])

	const changeHash = () => setHash(window.location.hash as Hash)

	useEffect(() => {
		if (!('Notification' in window)) {
			// Check if the browser supports notifications
			alert('Browser does not support desktop notification!')
		} else if (Notification.permission !== 'granted') {
			Notification.requestPermission().then((permission) => {
				console.debug(`Notification permission ${permission}...`)
			})
		}
		window.addEventListener('hashchange', changeHash)
		return () => window.removeEventListener('hashchange', changeHash)
	}, [])

	const Component = {
		'#/alarm': Alarm,
		'#/timer': Timer,
		'#/stopwatch': Stopwatch,
	}[hash]

	window.document.title = name

	return (
		<Layout name={name} hash={hash} maximized={maximized} setHash={setHash}>
			<Component maximized={maximized} setMaximized={setMaximized} />
		</Layout>
	)
}

dayjs.extend(customParseFormat)
dayjs.extend(objectSupport)
dayjs.extend(relativeTime)
dayjs.extend(utc)

const rootEl = document.getElementById('app')!
createRoot(rootEl).render(<App />)
