import { createId } from '@paralleldrive/cuid2'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Fragment, type JSX } from 'react/jsx-runtime'

import { BellCrossed, Chevron, Edit, Music, Pause, Play } from '@/assets/icons'
import ascending from '@/assets/media/ascending.wav'
import bounce from '@/assets/media/bounce.wav'
import chimes from '@/assets/media/chimes.wav'
import chords from '@/assets/media/chords.wav'
import descending from '@/assets/media/descending.wav'
import echo from '@/assets/media/echo.wav'
import jingle from '@/assets/media/jingle.wav'
import tap from '@/assets/media/tap.wav'
import transition from '@/assets/media/transition.wav'
import xylophone from '@/assets/media/xylophone.wav'
import { MAX_MINUTES } from '@/config'
import db from '@/database'
import type { IModalProps } from '@/hooks/useModal'
import m from '@/styles/modalContent.module.scss'
import type { Day, IAlarm, IChime, IInterval, Meridian } from '@/types/Alarm'
import type { SelectedValue } from '@/types/Common'
import { getClass, padZero } from '@/utils'

import s from './index.module.scss'

interface IAlarmModalProps {
	id?: IAlarm['id']
	Modal: React.MemoExoticComponent<({ title, children }: IModalProps) => JSX.Element | null>
	defaultValues?: Omit<Record<SelectedValue, number> & { phase: Meridian }, 'second'> & {
		title: IAlarm['title']
		chime: IAlarm['chime']
		repeatOn: IAlarm['repeatOn']
		interval: IAlarm['snoozeDuration']
		repeatEnabled: IAlarm['repeatEnabled']
	}
}

export const days: Array<Day> = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const chimeOptions: Array<IChime> = [
	{ id: '1', title: 'Chimes', media: chimes },
	{ id: '2', title: 'Xylophone', media: xylophone },
	{ id: '3', title: 'Chords', media: chords },
	{ id: '4', title: 'Tap', media: tap },
	{ id: '5', title: 'Jingle', media: jingle },
	{ id: '6', title: 'Transition', media: transition },
	{ id: '7', title: 'Descending', media: descending },
	{ id: '8', title: 'Bounce', media: bounce },
	{ id: '9', title: 'Echo', media: echo },
	{ id: '10', title: 'Ascending', media: ascending },
]

const intervalOptions: Array<IInterval> = [
	{ id: '0', title: 'Disabled', value: 0 },
	{ id: '1', title: '5 Minutes', value: 1000 * 60 * 5 },
	{ id: '2', title: '10 Minutes', value: 1000 * 60 * 10 },
	{ id: '3', title: '15 Minutes', value: 1000 * 60 * 15 },
	{ id: '4', title: '30 Minutes', value: 1000 * 60 * 30 },
	{ id: '5', title: '45 Minutes', value: 1000 * 60 * 45 },
	{ id: '6', title: '1 Hour', value: 1000 * 60 * 60 },
]

const AlarmModal = ({ id, Modal, defaultValues }: IAlarmModalProps) => (
	<Modal title={defaultValues ? 'Edit Alarm' : 'Add Alarm'} showDeleteIcon={!!defaultValues}>
		{({ onSave, onDelete, toggleModal }) => {
			const [hour, setHour] = useState<number>(defaultValues?.hour || 12)
			const [title, setTitle] = useState<string>(defaultValues?.title || '')
			const [minute, setMinute] = useState<number>(defaultValues?.minute || 0)
			const [phase, setPhase] = useState<Meridian>(defaultValues?.phase || 'AM')

			const [valueSelected, setValueSelected] = useState<SelectedValue>('hour')
			const [dropdownActive, setDropdownActive] = useState<number | null>(null)

			const [repeatOn, setRepeatOn] = useState<Array<Day>>(defaultValues?.repeatOn || days)
			const [repeating, setRepeating] = useState<boolean>(defaultValues?.repeatEnabled ?? true)
			const [selectedChime, setSelectedChime] = useState<IChime>(defaultValues?.chime || chimeOptions[0])
			const [selectedInterval, setSelectedInterval] = useState<IInterval>(defaultValues?.interval || intervalOptions[0])

			const repeatAlarmSwitchId = useId()

			const currentChimeIndex = useMemo(
				() => chimeOptions.findIndex(({ id }) => selectedChime.id === id),
				[selectedChime],
			)
			const currentIntervalIndex = useMemo(
				() => intervalOptions.findIndex(({ id }) => selectedInterval.id === id),
				[selectedInterval],
			)

			onSave.current = () => {
				if (!title) return

				if (defaultValues && id !== undefined) {
					db.alarms.update(id!, {
						title,
						repeatOn,
						chime: selectedChime,
						repeatEnabled: repeating,
						endAt: { hour, minute, phase },
						snoozeDuration: selectedInterval,
					})
				} else {
					db.alarms.add({
						id: createId(),
						title,
						repeatOn,
						isActive: true,
						chime: selectedChime,
						repeatEnabled: repeating,
						endAt: { hour, minute, phase },
						snoozeDuration: selectedInterval,
					})
				}

				toggleModal()
			}

			onDelete.current = () => {
				db.alarms.delete(id!)
				toggleModal()
			}

			return (
				<Fragment>
					<div className={getClass(m.container, m.containerWrapper)}>
						<div className={m.container}>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setHour((h) => (h === 12 ? 1 : h + 1))
									setValueSelected('hour')
								}}
							>
								<Chevron.Up />
							</span>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setMinute((m) => (m === MAX_MINUTES ? 0 : m + 1))
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
								<span className={m.digit}>{padZero(hour)}</span>
							</div>
							<span className={m.digit}>:</span>
							<div
								className={getClass(m.digitWrapper, valueSelected === 'minute' && m.digitWrapperSelected)}
								onClick={() => setValueSelected('minute')}
							>
								<span className={m.digit}>{padZero(minute)}</span>
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
									setHour((h) => h - 1 || 12)
									setValueSelected('hour')
								}}
							>
								<Chevron.Down />
							</span>
							<span
								className={getClass('pointer', m.icon)}
								onClick={() => {
									setMinute((m) => (m ? m - 1 : MAX_MINUTES))
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
						<input type='text' value={title} className={m.input} onChange={({ target }) => setTitle(target.value)} />
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

					<div className={getClass(m.container, m.containerPadded)} style={{ justifyContent: 'space-evenly' }}>
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
						<Music width={18} height={18} />
						<div className={m.dropdown} onClick={() => !dropdownActive && setDropdownActive(1)}>
							{selectedChime.title}
							<div
								className={getClass(m.dropdownOptionWrapper, dropdownActive === 1 && m.dropdownOptionWrapperActive)}
								style={{ top: -((currentChimeIndex > 5 ? 5 : currentChimeIndex) * 37) }}
							>
								{chimeOptions.map((chime) => {
									const media = useRef<HTMLAudioElement | null>(null)
									const [playing, setPlaying] = useState<boolean>(true)
									const toggleMediaStatus = () => setPlaying((p) => !p)

									useEffect(() => {
										if (playing) {
											if (!media.current?.ended) {
												media.current?.pause()
											}
										} else {
											media.current?.play()
										}
									}, [playing])

									useEffect(() => {
										media.current?.addEventListener('ended', toggleMediaStatus)
										return () => {
											media.current?.removeEventListener('ended', toggleMediaStatus)
										}
									}, [])

									return (
										<div key={chime.id} className={m.dropdownOption}>
											<audio ref={media} src={chime.media} />
											<span className='pointer' onClick={toggleMediaStatus}>
												{playing ? <Play fill='white' /> : <Pause fill='white' />}
											</span>
											<span
												onClick={() => {
													setSelectedChime(chime)
													setDropdownActive(null)
												}}
											>
												{chime.title}
											</span>
										</div>
									)
								})}
							</div>
						</div>
					</div>

					{false && (
						<div title='Snooze Time' className={getClass(m.container, m.containerDropdown)}>
							<BellCrossed width={18} height={18} />
							<div className={m.dropdown} onClick={() => !dropdownActive && setDropdownActive(2)}>
								{selectedInterval.title}
								<div
									className={getClass(m.dropdownOptionWrapper, dropdownActive === 2 && m.dropdownOptionWrapperActive)}
									style={{ top: -((currentIntervalIndex > 5 ? 5 : currentIntervalIndex) * 37) }}
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
											{interval.title}
										</span>
									))}
								</div>
							</div>
						</div>
					)}
				</Fragment>
			)
		}}
	</Modal>
)

export default AlarmModal
