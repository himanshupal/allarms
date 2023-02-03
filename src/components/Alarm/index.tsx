import { Fragment, useId, useMemo, useState } from 'react'
import { Chevron, Edit, Plus } from '@/components/Icons'
import useModal, { IModalProps } from '@/hooks/useModal'
import type { ICommonProps } from '@/types/Common'
import { getClass, padZero } from '@/utils'
import Toggle from '@/components/Toggle'
import { MAX_MINUTES } from '@/config'

import m from '@/styles/modalContent.module.scss'
import s from './styles.module.scss'

import transition from '@/assets/media/transition.wav'
import descending from '@/assets/media/descending.wav'
import xylophone from '@/assets/media/xylophone.wav'
import ascending from '@/assets/media/ascending.wav'
import chimes from '@/assets/media/chimes.wav'
import chords from '@/assets/media/chords.wav'
import jingle from '@/assets/media/jingle.wav'
import bounce from '@/assets/media/bounce.wav'
import echo from '@/assets/media/echo.wav'
import tap from '@/assets/media/tap.wav'

type SelectedValue = 'hour' | 'minute' | 'second'
type Day = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa'

interface IChime {
	id: string
	name: string
	media: string
}

interface IInterval {
	id: string
	name: string
	value: number
}

interface IAlarmCardProps extends ICommonProps {
	title: string
	endAt: number
	repeatOn: Array<Day>
	snoozeDuration: number
}

interface IAlarm {
	snoozeDuration: number
	repeatOn: Array<Day>
	endAt: number
	title: string
	id: number
}

interface ITimerModalProps {
	id?: number
	Modal: React.MemoExoticComponent<({ title, children }: IModalProps) => JSX.Element | null>
	defaultValues?: Record<SelectedValue, number> & { title: string; chime: IChime; interval: IInterval }
	setAlarms: React.Dispatch<React.SetStateAction<Array<IAlarm>>>
}

const days: Array<Day> = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const chimeOptions: Array<IChime> = [
	{ id: '1', name: 'Chimes', media: chimes },
	{ id: '2', name: 'Xylophone', media: xylophone },
	{ id: '3', name: 'Chords', media: chords },
	{ id: '4', name: 'Tap', media: tap },
	{ id: '5', name: 'Jingle', media: jingle },
	{ id: '6', name: 'Transition', media: transition },
	{ id: '7', name: 'Descending', media: descending },
	{ id: '8', name: 'Bounce', media: bounce },
	{ id: '9', name: 'Echo', media: echo },
	{ id: '10', name: 'Ascending', media: ascending },
]

const intervalOptions: Array<IInterval> = [
	{ id: '0', name: 'Disabled', value: 0 },
	{ id: '1', name: '5 Minutes', value: 1000 * 60 * 5 },
	{ id: '2', name: '10 Minutes', value: 1000 * 60 * 10 },
	{ id: '3', name: '15 Minutes', value: 1000 * 60 * 15 },
	{ id: '4', name: '30 Minutes', value: 1000 * 60 * 30 },
	{ id: '5', name: '45 Minutes', value: 1000 * 60 * 45 },
	{ id: '6', name: '1 Hour', value: 1000 * 60 * 60 },
]

const AlarmCard: React.FC<IAlarmCardProps> = ({ title, endAt, repeatOn, snoozeDuration }) => {
	const [isActive, setIsActive] = useState<boolean>(false)

	const toggleAlarm = () => setIsActive((a) => !a)

	return (
		<div className={s.alarmCard}>
			<div className={s.alarmCardEndTimeContainer}>
				<div className={s.alarmCardEndTime}>
					7:00
					<span>AM</span>
				</div>
				<Toggle checked={isActive} onToggle={toggleAlarm} />
			</div>
			<div className={s.alarmCardTimeLeft}>
				{/* <Bell /> */}
				Rings in 12 hours, 2 minutes
			</div>
			<div className={s.alarmCardTitle}>{title}</div>
			<div className={s.alarmCardDayRow}>
				{days.map((day) => (
					<div key={day} className={getClass('pointer', s.alarmDay, repeatOn.includes(day) && s.alarmDayActive)}>
						{day}
					</div>
				))}
			</div>
		</div>
	)
}

const AlarmModal: React.FC<ITimerModalProps> = ({ id, Modal, setAlarms, defaultValues }) => (
	<Modal title={defaultValues ? 'Edit Alarm' : 'Add Alarm'} showDeleteIcon={!!defaultValues}>
		{({ onSave, onDelete, toggleModal }) => {
			const [phase, setPhase] = useState<'AM' | 'PM'>('AM')
			const [name, setName] = useState<string>(defaultValues?.title || '')
			const [hours, setHours] = useState<number>(defaultValues?.hour || 12)
			const [minutes, setMinutes] = useState<number>(defaultValues?.minute || 0)
			const [valueSelected, setValueSelected] = useState<SelectedValue>('hour')
			const [dropdownActive, setDropdownActive] = useState<number | null>(null)

			const [selectedChime, setSelectedChime] = useState<IChime>(defaultValues?.chime || chimeOptions[0])
			const [selectedInterval, setSelectedInterval] = useState<IInterval>(defaultValues?.interval || intervalOptions[0])

			const [repeatOn, setRepeatOn] = useState<Array<Day>>(days)
			const [repeating, setRepeating] = useState<boolean>(true)
			const repeatAlarmSwitchId = useId()

			const currentChimeIndex = useMemo(
				() => chimeOptions.findIndex(({ id }) => selectedChime.id === id),
				[selectedChime]
			)
			const currentIntervalIndex = useMemo(
				() => intervalOptions.findIndex(({ id }) => selectedInterval.id === id),
				[selectedInterval]
			)

			onSave.current = () => {
				const minutesToSave = minutes * 60 * 1000
				const hoursToSave = hours * 60 * 60 * 1000
				const endAt = (hoursToSave + minutesToSave) / 10
				if (!name || !endAt) return

				let alarms: Array<IAlarm> | ((prevState: Array<IAlarm>) => Array<IAlarm>)
				if (defaultValues && id !== undefined) {
					alarms = (t) =>
						t.map((v) =>
							v.id === id ? { id, title: name, endAt, repeatOn, snoozeDuration: selectedInterval.value / 10 } : v
						)
				} else {
					alarms = (t) => [
						...t,
						{ id: t.length, title: name, endAt, repeatOn, snoozeDuration: selectedInterval.value / 10 },
					]
				}

				setAlarms(alarms)
				toggleModal()
			}

			onDelete.current = () => {
				setAlarms((t) => t.filter(({ id: tId }) => tId !== id))
				toggleModal()
			}

			return (
				<Fragment>
					<div className={getClass(m.container, m.containerWrapper)}>
						<div className={m.container}>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setHours((h) => (h === 12 ? 1 : h + 1))
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
									setPhase((p) => (p === 'AM' ? 'PM' : 'AM'))
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
								<span className={m.digit}>{phase}</span>
							</div>
						</div>

						<div className={m.container}>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setHours((h) => h - 1 || 12)
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
									setPhase((p) => (p === 'AM' ? 'PM' : 'AM'))
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

					<div className={getClass(m.container, m.containerPadded, m.containerCheckbox)}>
						<input
							type='checkbox'
							checked={repeating}
							id={repeatAlarmSwitchId}
							onChange={() => setRepeating((r) => !r)}
						/>
						<label htmlFor={repeatAlarmSwitchId}>Repeat Alarm</label>
					</div>

					<div className={getClass(m.container, m.containerPadded)}>
						{days.map((day) => (
							<div
								key={day}
								className={getClass('pointer', s.alarmDay, repeating && repeatOn.includes(day) && s.alarmDayActive)}
								onClick={() => {
									if (!repeating) return
									setRepeatOn((r) => (r.includes(day) ? r.filter((d) => d !== day) : r.concat(day)))
								}}
							>
								{day}
							</div>
						))}
					</div>

					<div title='Alarm Chime' className={getClass(m.container, m.containerDropdown)}>
						<Edit width={18} height={18} />
						<div className={m.dropdown} onClick={() => !dropdownActive && setDropdownActive(1)}>
							{selectedChime.name}
							<div
								className={getClass(m.dropdownOptionWrapper, dropdownActive === 1 && m.dropdownOptionWrapperActive)}
								style={{ top: -(currentChimeIndex * 37) }}
							>
								{chimeOptions.map((chime) => (
									<span
										key={chime.id}
										onClick={() => {
											setSelectedChime(chime)
											setDropdownActive(null)
										}}
										className={m.dropdownOption}
									>
										{chime.name}
									</span>
								))}
							</div>
						</div>
					</div>

					<div title='Snooze Time' className={getClass(m.container, m.containerDropdown)}>
						<Edit width={18} height={18} />
						<div className={m.dropdown} onClick={() => !dropdownActive && setDropdownActive(2)}>
							{selectedInterval.name}
							<div
								className={getClass(m.dropdownOptionWrapper, dropdownActive === 2 && m.dropdownOptionWrapperActive)}
								style={{ top: -(currentIntervalIndex * 37) }}
							>
								{intervalOptions.map((interval) => (
									<span
										key={interval.id}
										onClick={() => {
											setSelectedInterval(interval)
											setDropdownActive(null)
										}}
										className={m.dropdownOption}
									>
										{interval.name}
									</span>
								))}
							</div>
						</div>
					</div>
				</Fragment>
			)
		}}
	</Modal>
)

const Alarm: React.FC<ICommonProps> = (props) => {
	const [alarms, setAlarms] = useState<Array<IAlarm>>([
		{ title: 'Test', id: 1, endAt: 153, repeatOn: ['Mo', 'Sa'], snoozeDuration: 1555 },
	])
	const { toggleModal, Modal } = useModal()
	const { maximized } = props

	return (
		<Fragment>
			<AlarmModal Modal={Modal} setAlarms={setAlarms} />

			{alarms.map(({ id, title, repeatOn, endAt, snoozeDuration }) => (
				<AlarmCard
					key={id}
					{...props}
					title={title}
					endAt={endAt}
					repeatOn={repeatOn}
					snoozeDuration={snoozeDuration}
				/>
			))}

			{!maximized && (
				<div title='Add Alarm' className={getClass('pointer', s.alarmNew)} onClick={toggleModal}>
					<Plus />
				</div>
			)}
		</Fragment>
	)
}

export default Alarm
