import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import objectSupport from 'dayjs/plugin/objectSupport'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { Suspense, lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from '@/components/Layout'
import { THEME_STORAGE_KEY } from '@/config'
import '@/styles/main.scss'
import { Theme } from '@/types/Theme'

const Alarm = lazy(() => import('@/pages/Alarm'))
const Timer = lazy(() => import('@/pages/Timer'))
const Stopwatch = lazy(() => import('@/pages/Stopwatch'))

const App = function () {
	const [theme, setTheme] = useState<Theme>(Theme.ALPHA)

	useEffect(() => {
		const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
		const themeToUse = savedTheme || String(theme)

		window.document.body.setAttribute(THEME_STORAGE_KEY, themeToUse)
		window.localStorage.setItem(THEME_STORAGE_KEY, themeToUse)
	}, [theme])

	useEffect(() => {
		if (!('Notification' in window)) {
			// Check if the browser supports notifications
			alert('Browser does not support desktop notification!')
		} else if (Notification.permission !== 'granted') {
			Notification.requestPermission().then((permission) => {
				console.debug(`Notification permission ${permission}...`)
			})
		}
	}, [])

	return (
		<BrowserRouter>
			<HelmetProvider>
				<Suspense fallback={<Layout isLoading />}>
					<Routes>
						<Route path='/' Component={Layout}>
							<Route path='/alarm' Component={Alarm} />
							<Route path='/timer' Component={Timer} />
							<Route path='/stopwatch' Component={Stopwatch} />
						</Route>
					</Routes>
				</Suspense>
			</HelmetProvider>
		</BrowserRouter>
	)
}

dayjs.extend(customParseFormat)
dayjs.extend(objectSupport)
dayjs.extend(relativeTime)
dayjs.extend(utc)

const rootEl = document.getElementById('app')!
createRoot(rootEl).render(<App />)
