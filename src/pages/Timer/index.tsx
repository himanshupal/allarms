import { useLiveQuery } from 'dexie-react-hooks'
import { Fragment, useState } from 'react'

import { Plus } from '@/assets/icons'
import db from '@/database'
import useModal from '@/hooks/useModal'
import useStore from '@/store'
import type { ITimer } from '@/types/Timer'
import { getClass } from '@/utils'

import Card from './Card'
import TimerModal from './Modal'
import s from './index.module.scss'

const Timer = () => {
	const [maximizedCounter, setMaximizedCounter] = useState<ITimer['id']>()
	const timers = useLiveQuery(() => db.timers.toArray(), [])
	const { maximized, toggleMaximized } = useStore()
	const { toggleModal, Modal } = useModal()

	return (
		<Fragment>
			<TimerModal Modal={Modal} />

			<div className={getClass(s.timer, maximized && s.timerMaximized)}>
				{timers
					?.filter(({ id }) => (maximizedCounter !== undefined ? id === maximizedCounter : true))
					.map(({ id, name, duration }) => (
						<Card id={id} key={id} name={name} duration={duration} setMaximizedCounter={setMaximizedCounter} />
					))}
			</div>

			{!maximized && (
				<div title='New Timer' className={getClass('pointer', s.timerNew)} onClick={toggleModal}>
					<Plus />
				</div>
			)}
		</Fragment>
	)
}

export default Timer
