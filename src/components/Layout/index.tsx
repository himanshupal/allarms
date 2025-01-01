import { Outlet, useLocation } from 'react-router-dom'

import { Page } from '@/config'
import { getClass } from '@/utils'

import s from './index.module.scss'

interface ILayoutProps {
	isLoading?: true
}

const Layout = ({ isLoading }: ILayoutProps) => {
	const { pathname } = useLocation()
	const maximized = false

	const name = {
		[Page.Alarm]: 'Alarm',
		[Page.Timer]: 'Timer',
		[Page.Stopwatch]: 'Stopwatch',
	}[pathname]

	return (
		<div className={s.container}>
			{!maximized && (
				<aside className={s.sidebar}>
					<a className={getClass(s.link, pathname === Page.Timer && s.linkActive)} href={Page.Timer}>
						Timer
					</a>
					<a className={getClass(s.link, pathname === Page.Alarm && s.linkActive)} href={Page.Alarm}>
						Alarm
					</a>
					<a className={getClass(s.link, pathname === Page.Stopwatch && s.linkActive)} href={Page.Stopwatch}>
						Stopwatch
					</a>
				</aside>
			)}

			<section className={getClass(s.content,  s[`content${name}`])}>
				<Outlet />

				{isLoading ? 'Loading...' : null}
			</section>
		</div>
	)
}

export default Layout
