import { createId } from '@paralleldrive/cuid2'
import { Fragment, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'

import { Chevron, Edit } from '@/assets/icons'
import { MAX_HOURS, MAX_MINUTES, MAX_SECONDS } from '@/config'
import db from '@/database'
import type { IModalProps } from '@/hooks/useModal'
import m from '@/styles/modalContent.module.scss'
import type { SelectedValue } from '@/types/Common'
import type { ITimer } from '@/types/Timer'
import { getClass, padZero } from '@/utils'

interface ITimerModalProps {
	id?: ITimer['id']
	Modal: React.MemoExoticComponent<({ title, children }: IModalProps) => JSX.Element | null>
	defaultValues?: Record<SelectedValue, number> & { name: string }
}

const TimerModal = ({ id, Modal, defaultValues }: ITimerModalProps) => (
	<Modal title={defaultValues ? 'Edit Timer' : 'Add New Timer'} showDeleteIcon={!!defaultValues}>
		{({ onSave, onDelete, toggleModal }) => {
			const [name, setName] = useState<string>(defaultValues?.name || '')
			const [hours, setHours] = useState<number>(defaultValues?.hour || 0)
			const [minutes, setMinutes] = useState<number>(defaultValues?.minute || 0)
			const [seconds, setSeconds] = useState<number>(defaultValues?.second || 0)
			const [valueSelected, setValueSelected] = useState<SelectedValue>('hour')

			onSave.current = () => {
				const secondsToSave = seconds * 1000
				const minutesToSave = minutes * 60 * 1000
				const hoursToSave = hours * 60 * 60 * 1000
				const duration = (hoursToSave + minutesToSave + secondsToSave) / 10
				if (!name || !duration) return

				if (defaultValues && id !== undefined) {
					db.timers.update(id!, { name, duration })
				} else {
					db.timers.add({ id: createId(), name, duration })
				}

				toggleModal()
			}

			onDelete.current = () => {
				db.timers.delete(id!)
				toggleModal()
			}

			return (
				<Fragment>
					<div className={getClass(m.container, m.containerWrapper)}>
						<div className={m.container}>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setHours((h) => (h === MAX_HOURS ? 0 : h + 1))
									setValueSelected('hour')
								}}
							>
								<Chevron.Up />
							</span>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setMinutes((m) => (m === MAX_MINUTES ? 0 : m + 1))
									setValueSelected('minute')
								}}
							>
								<Chevron.Up />
							</span>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setSeconds((s) => (s === MAX_SECONDS ? 0 : s + 1))
									setValueSelected('second')
								}}
							>
								<Chevron.Up />
							</span>
						</div>

						<div className={getClass(m.container, m.containerDigits)}>
							<div
								className={getClass(m.digitWrapper, valueSelected === 'hour' && m.digitWrapperSelected)}
								onClick={() => setValueSelected('hour')}
							>
								<span className={m.digit}>{padZero(hours)}</span>
							</div>
							<span className={m.digit}>:</span>
							<div
								className={getClass(m.digitWrapper, valueSelected === 'minute' && m.digitWrapperSelected)}
								onClick={() => setValueSelected('minute')}
							>
								<span className={m.digit}>{padZero(minutes)}</span>
							</div>
							<span className={m.digit}>:</span>
							<div
								className={getClass(m.digitWrapper, valueSelected === 'second' && m.digitWrapperSelected)}
								onClick={() => setValueSelected('second')}
							>
								<span className={m.digit}>{padZero(seconds)}</span>
							</div>
						</div>

						<div className={m.container}>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setHours((h) => (h ? h - 1 : MAX_HOURS))
									setValueSelected('hour')
								}}
							>
								<Chevron.Down />
							</span>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setMinutes((m) => (m ? m - 1 : MAX_MINUTES))
									setValueSelected('minute')
								}}
							>
								<Chevron.Down />
							</span>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setSeconds((s) => (s ? s - 1 : MAX_SECONDS))
									setValueSelected('second')
								}}
							>
								<Chevron.Down />
							</span>
						</div>
					</div>

					<div className={m.inputWrapper}>
						<Edit width={18} height={18} />
						<input type='text' value={name} className={m.input} onChange={({ target }) => setName(target.value)} />
					</div>
				</Fragment>
			)
		}}
	</Modal>
)

export default TimerModal
