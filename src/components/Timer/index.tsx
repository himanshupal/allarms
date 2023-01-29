import { Maximize, Minimize, Pause, Play, Undo, Plus, Edit, Chevron } from '@/components/Icons'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { getClass, getElapsed, padZero } from '@/utils'
import type { ICommonProps } from '@/types/Common'
import type { IModalProps } from '@/hooks/useModal'
import useModal from '@/hooks/useModal'

import m from '@/styles/modalContent.module.scss'
import s from './styles.module.scss'

type SelectedValue = 'hour' | 'minute' | 'second'

interface ITimer {
	duration: number
	name: string
	id: number
}

interface ICounterProps extends ITimer, ICommonProps {
	setMaximizedCounter: React.Dispatch<React.SetStateAction<number | undefined>>
	setTimers: React.Dispatch<React.SetStateAction<Array<ITimer>>>
}

interface ITimerModalProps {
	id?: number
	Modal: React.MemoExoticComponent<({ title, children }: IModalProps) => JSX.Element | null>
	setTimers: React.Dispatch<React.SetStateAction<Array<ITimer>>>
	defaultValues?: Record<SelectedValue, number> & { name: string }
}

const MAX_HOURS = 99
const MAX_MINUTES = 59
const MAX_SECONDS = 59

const Counter = ({ id, name, duration, maximized, setMaximized, setTimers, setMaximizedCounter }: ICounterProps) => {
	const CIRCLE_FRACTIONS = maximized ? 1256 : 628

	const fraction = useRef<number>(CIRCLE_FRACTIONS)
	const [elapsed, setElapsed] = useState<number>(duration)
	const [isActive, setActive] = useState<boolean>(false)
	const [timer, setTimer] = useState<NodeJS.Timer>()

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

	useEffect(() => {
		setElapsed(duration)
	}, [duration])

	useEffect(() => {
		if (timer && !elapsed) {
			clearInterval(timer)
			setActive(false)
			reset()
		}
	}, [timer, elapsed])

	return (
		<Fragment>
			<TimerModal
				id={id}
				Modal={Modal}
				setTimers={setTimers}
				defaultValues={{ name, hour: +hours, minute: +minutes, second: +seconds }}
			/>

			<div className={s.timerCard}>
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
						className={getClass(s.timerRing, isActive && s.timerRingActive)}
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

const TimerModal = ({ id, Modal, setTimers, defaultValues }: ITimerModalProps) => (
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

				let timers: Array<ITimer> | ((prevState: Array<ITimer>) => Array<ITimer>)
				if (defaultValues && id !== undefined) {
					timers = (t) => t.map((v) => (v.id === id ? { id, name, duration } : v))
				} else {
					timers = (t) => [...t, { id: t.length, name, duration }]
				}

				setTimers(timers)
				toggleModal()
			}

			onDelete.current = () => {
				setTimers((t) => t.filter(({ id: tId }) => tId !== id))
				toggleModal()
			}

			return (
				<Fragment>
					<div className={m.timerContainer}>
						<div className={m.timerContainerUp}>
							<span
								className={getClass('pointer', m.timerIcon)}
								onClick={() => {
									setHours((h) => (h === MAX_HOURS ? 0 : h + 1))
									setValueSelected('hour')
								}}
							>
								<Chevron.Up />
							</span>
							<span
								className={getClass('pointer', m.timerIcon)}
								onClick={() => {
									setMinutes((m) => (m === MAX_MINUTES ? 0 : m + 1))
									setValueSelected('minute')
								}}
							>
								<Chevron.Up />
							</span>
							<span
								className={getClass('pointer', m.timerIcon)}
								onClick={() => {
									setSeconds((s) => (s === MAX_SECONDS ? 0 : s + 1))
									setValueSelected('second')
								}}
							>
								<Chevron.Up />
							</span>
						</div>

						<div className={m.timerContainerValues}>
							<div
								className={getClass(m.timerValue, valueSelected === 'hour' && m.timerValueSelected)}
								onClick={() => setValueSelected('hour')}
							>
								<span className={m.timerDigit}>{padZero(hours)}</span>
							</div>
							<span className={m.timerDigit}>:</span>
							<div
								className={getClass(m.timerValue, valueSelected === 'minute' && m.timerValueSelected)}
								onClick={() => setValueSelected('minute')}
							>
								<span className={m.timerDigit}>{padZero(minutes)}</span>
							</div>
							<span className={m.timerDigit}>:</span>
							<div
								className={getClass(m.timerValue, valueSelected === 'second' && m.timerValueSelected)}
								onClick={() => setValueSelected('second')}
							>
								<span className={m.timerDigit}>{padZero(seconds)}</span>
							</div>
						</div>

						<div className={m.timerContainerDown}>
							<span
								className={getClass('pointer', m.timerIcon)}
								onClick={() => {
									setHours((h) => (h ? h - 1 : MAX_HOURS))
									setValueSelected('hour')
								}}
							>
								<Chevron.Down />
							</span>
							<span
								className={getClass('pointer', m.timerIcon)}
								onClick={() => {
									setMinutes((m) => (m ? m - 1 : MAX_MINUTES))
									setValueSelected('minute')
								}}
							>
								<Chevron.Down />
							</span>
							<span
								className={getClass('pointer', m.timerIcon)}
								onClick={() => {
									setSeconds((s) => (s ? s - 1 : MAX_SECONDS))
									setValueSelected('second')
								}}
							>
								<Chevron.Down />
							</span>
						</div>
					</div>

					<div className={m.timerInputContainer}>
						<Edit width={18} height={18} />
						<input type='text' value={name} className={m.timerInput} onChange={({ target }) => setName(target.value)} />
					</div>
				</Fragment>
			)
		}}
	</Modal>
)

const Timer = ({ maximized, setMaximized }: ICommonProps) => {
	const [timers, setTimers] = useState<Array<ITimer>>([{ id: 0, name: '5 Seconds', duration: 500 }])
	const [maximizedCounter, setMaximizedCounter] = useState<ITimer['id']>()
	const { toggleModal, Modal } = useModal()

	return (
		<Fragment>
			<TimerModal Modal={Modal} setTimers={setTimers} />

			<div className={getClass(s.timer, maximized && s.timerMaximized)}>
				{timers
					.filter(({ id }) => (maximizedCounter !== undefined ? id === maximizedCounter : true))
					.map(({ id, name, duration }) => (
						<Counter
							id={id}
							key={id}
							name={name}
							duration={duration}
							maximized={maximized}
							setTimers={setTimers}
							setMaximized={setMaximized}
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
