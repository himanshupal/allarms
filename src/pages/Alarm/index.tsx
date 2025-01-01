import { useLiveQuery } from 'dexie-react-hooks'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'

import { Plus } from '@/assets/icons'
import db from '@/database'
import useModal from '@/hooks/useModal'
import useStore from '@/store'
import type { IAlarm } from '@/types/Alarm'
import { getClass } from '@/utils'

import Card from './Card'
import AlarmModal from './Modal'
import s from './index.module.scss'

const Alarm = () => {
	const alarms = useLiveQuery(() => db.alarms.toArray(), [])
	const { toggleModal, Modal } = useModal()
	const { maximized } = useStore()

	const toggleActive = (id: IAlarm['id']) => {
		db.alarms.get(id).then((v) => v && db.alarms.update(id, { isActive: !v.isActive }))
	}

	return (
		<Fragment>
			<Helmet>
				<title>Alarm</title>
			</Helmet>

			<AlarmModal Modal={Modal} />

			<div className={s.alarm}>
				{alarms?.map((alarm) => <Card key={alarm.id} {...alarm} toggleActive={toggleActive} />)}
			</div>

			{!maximized && (
				<div title='Add Alarm' className={getClass('pointer', s.alarmNew)} onClick={toggleModal}>
					<Plus />
				</div>
			)}
		</Fragment>
	)
}

export default Alarm
