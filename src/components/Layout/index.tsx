import type { FC, Dispatch, SetStateAction } from 'react'
import { getClass } from '@/utils'
import { Hash } from '@/config'

import s from './styles.module.scss'

interface ILayoutProps {
	children: JSX.Element
	setHash: Dispatch<SetStateAction<Hash>>
	maximized: boolean
	name: string
	hash: Hash
}

const Layout: FC<ILayoutProps> = ({ children, name, hash, setHash, maximized }) => {
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

			<section className={getClass(s.content, s[`content${name}`])}>{children}</section>
		</div>
	)
}

export default Layout
