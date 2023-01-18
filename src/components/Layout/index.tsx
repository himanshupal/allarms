import type { JSXInternal } from 'preact/src/jsx'
import { StateUpdater } from 'preact/hooks'
import { getClass } from '@/utils'
import { Hash } from '@/config'

import s from './styles.module.scss'

interface ILayoutProps {
	children: JSXInternal.Element
	setHash: StateUpdater<Hash>
	maximized: boolean
	hash: Hash
}

const Layout = ({ children, hash, setHash, maximized }: ILayoutProps) => {
	return (
		<div className={s.container}>
			{!maximized && (
				<aside className={s.sidebar}>
					<a
						className={getClass(s.link, hash === '#/timer' && s.linkActive)}
						onClick={() => setHash('#/timer')}
						href='/#/timer'
					>
						Timer
					</a>
					<a
						className={getClass(s.link, hash === '#/alarm' && s.linkActive)}
						onClick={() => setHash('#/alarm')}
						href='/#/alarm'
					>
						Alarm
					</a>
					<a
						className={getClass(s.link, hash === '#/stopwatch' && s.linkActive)}
						onClick={() => setHash('#/stopwatch')}
						href='/#/stopwatch'
					>
						Stopwatch
					</a>
				</aside>
			)}

			<section className={s.content}>{children}</section>
		</div>
	)
}

export default Layout
