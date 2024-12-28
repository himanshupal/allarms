import { Chevron, Edit, Maximize, Minimize, Pause, Play, Plus, Undo } from '@/assets/icons'
import { MAX_HOURS, MAX_MINUTES, MAX_SECONDS, SHAKE_ANIM_DURATION } from '@/config'
import db from '@/database'
import type { IModalProps } from '@/hooks/useModal'
import useModal from '@/hooks/useModal'
import type { ICommonProps, SelectedValue } from '@/types/Common'
import type { ITimer } from '@/types/Timer'
import { getClass, getElapsed, padZero } from '@/utils'
import { createId } from '@paralleldrive/cuid2'
import { useLiveQuery } from 'dexie-react-hooks'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'

import m from '@/styles/modalContent.module.scss'
import s from './index.module.scss'

export interface ICounterProps extends ITimer, ICommonProps {
	setMaximizedCounter: React.Dispatch<React.SetStateAction<ITimer['id'] | undefined>>
}

interface ITimerModalProps {
	id?: ITimer['id']
	Modal: React.MemoExoticComponent<({ title, children }: IModalProps) => JSX.Element | null>
	defaultValues?: Record<SelectedValue, number> & { name: string }
}

const Counter = ({ id, name, duration, maximized, setMaximized, setMaximizedCounter }: ICounterProps) => {
	const CIRCLE_FRACTIONS = maximized ? 1256 : 628

	const fraction = useRef<number>(CIRCLE_FRACTIONS)
	const [elapsed, setElapsed] = useState<number>(duration)
	const [isActive, setActive] = useState<boolean>(false)
	const [timer, setTimer] = useState<NodeJS.Timeout>()
	const [ended, setEnded] = useState<boolean>(false)

	const { toggleModal, Modal } = useModal()
	const { hours, minutes, seconds } = useMemo(() => getElapsed(elapsed), [elapsed])

	const startOrPause = () => {
		if (isActive) {
			clearInterval(timer)
			setActive(false)
		} else {
			const _timer = setInterval(() => {
				setElapsed((e) => {
					fraction.current = (CIRCLE_FRACTIONS * (e / duration) * 100) / 100
					return e - 1
				})
			}, 10)
			setActive(true)
			setTimer(_timer)
		}
	}

	const reset = () => {
		fraction.current = CIRCLE_FRACTIONS
		setElapsed(duration)
	}

	useEffect(() => setElapsed(duration), [duration])

	useEffect(() => {
		if (ended) {
			const timer = setTimeout(() => setEnded(false), SHAKE_ANIM_DURATION)
			return () => clearTimeout(timer)
		}
	}, [ended])

	useEffect(() => {
		if (timer && !elapsed) {
			new Notification(`Time's up - ${name}`)
			clearInterval(timer)
			setActive(false)
			setEnded(true)
			reset()
		}
	}, [timer, elapsed])

	return (
		<Fragment>
			<TimerModal id={id} Modal={Modal} defaultValues={{ name, hour: +hours, minute: +minutes, second: +seconds }} />

			<div className={getClass(s.timerCard, ended && 'shaking')}>
				<div className={getClass(s.actions, s.actionsTop)}>
					{maximized ? <span /> : <span>{name}</span>}
					<div className={s.timerIcons}>
						{!maximized && (
							<span title='Edit Timer' className={getClass('pointer', s.timerIcon)} onClick={toggleModal}>
								<Edit />
							</span>
						)}
						<span
							title={maximized ? 'Minimize' : 'Maximize'}
							className={getClass('pointer', s.timerIcon)}
							onClick={() => (setMaximizedCounter(maximized ? undefined : id), setMaximized((m) => !m))}
						>
							{maximized ? <Minimize /> : <Maximize />}
						</span>
					</div>
				</div>

				<div className={getClass(s.timerRingContainer)}>
					<span className={getClass(s.timerDigits, isActive && s.timerDigitsActive)}>
						{`${hours}:${minutes}:${seconds}`}
					</span>
					<svg
						width={maximized ? 440 : 220}
						height={maximized ? 440 : 220}
						className={getClass(s.timerRing, (isActive || elapsed !== duration) && s.timerRingActive)}
					>
						<circle r={maximized ? 220 : 110} cx={maximized ? 220 : 110} cy={maximized ? 220 : 110} />
						<circle
							r={maximized ? 200 : 100}
							cx={maximized ? 220 : 110}
							cy={maximized ? 220 : 110}
							style={
								fraction.current !== CIRCLE_FRACTIONS
									? { strokeDasharray: `${fraction.current} ${CIRCLE_FRACTIONS}` }
									: undefined
							}
						/>
						<circle r={maximized ? 180 : 90} cx={maximized ? 220 : 110} cy={maximized ? 220 : 110} />
					</svg>
				</div>

				<div className={getClass(s.actions, s.actionsBottom, maximized && s.actionsBottomMaximized)}>
					<span onClick={startOrPause}>
						{isActive ? (
							<Pause width={maximized ? 32 : undefined} height={maximized ? 32 : undefined} />
						) : (
							<Play width={maximized ? 32 : undefined} height={maximized ? 32 : undefined} />
						)}
					</span>
					<span onClick={reset}>
						<Undo width={maximized ? 28 : undefined} height={maximized ? 28 : undefined} fill='#fff' />
					</span>
				</div>
			</div>
		</Fragment>
	)
}

const TimerModal: React.FC<ITimerModalProps> = ({ id, Modal, defaultValues }) => (
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

const Timer: React.FC<ICommonProps> = (props) => {
	const [maximizedCounter, setMaximizedCounter] = useState<ITimer['id']>()
	const timers = useLiveQuery(() => db.timers.toArray(), [])
	const { toggleModal, Modal } = useModal()
	const { maximized } = props

	return (
		<Fragment>
			<TimerModal Modal={Modal} />

			<div className={getClass(s.timer, maximized && s.timerMaximized)}>
				{timers
					?.filter(({ id }) => (maximizedCounter !== undefined ? id === maximizedCounter : true))
					.map(({ id, name, duration }) => (
						<Counter
							id={id}
							key={id}
							{...props}
							name={name}
							duration={duration}
							setMaximizedCounter={setMaximizedCounter}
						/>
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
