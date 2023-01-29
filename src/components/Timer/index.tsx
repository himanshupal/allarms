import { Maximize, Minimize, Pause, Play, Undo, Plus, Edit, Chevron } from '@/components/Icons'
import { getClass, getElapsed, padZero } from '@/utils'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { ICommonProps } from '@/types/Common'
import useModal from '@/hooks/useModal'

import m from '@/styles/modalContent.module.scss'
import s from './styles.module.scss'

type SelectedValue = 'hour' | 'minute' | 'second'

interface ITimer {
	duration: number
	name: string
}

interface ICounterProps extends ITimer {
	maximized: boolean
}

const MAX_HOURS = 99
const MAX_MINUTES = 59
const MAX_SECONDS = 59
const CIRCLE_FRACTIONS = 628

const Counter = ({ name, duration, maximized }: ICounterProps) => {
	const fraction = useRef<number>(CIRCLE_FRACTIONS)
	const [elapsed, setElapsed] = useState<number>(duration)
	const [isActive, setActive] = useState<boolean>(false)
	const [timer, setTimer] = useState<NodeJS.Timer>()

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
		clearInterval(timer)
		setElapsed(duration)
		setActive(false)
	}

	useEffect(() => {
		if (timer && !elapsed) {
			return () => clearInterval(timer)
		}
	}, [timer, elapsed])

	return (
		<div className={s.timerCard}>
			<div className={getClass(s.actions, s.actionsTop)}>
				<span>{name}</span>
				{maximized ? <Minimize /> : <Maximize />}
			</div>

			<div className={getClass(s.timerRingContainer)}>
				<span className={getClass(s.timerDigits, isActive && s.timerDigitsActive)}>
					{`${hours}:${minutes}:${seconds}`}
				</span>
				<svg width='220' height='220' className={getClass(s.timerRing, isActive && s.timerRingActive)}>
					<circle r='110' cx='110' cy='110' />
					<circle
						r='100'
						cx='110'
						cy='110'
						style={
							fraction.current !== CIRCLE_FRACTIONS
								? { strokeDasharray: `${fraction.current} ${CIRCLE_FRACTIONS}` }
								: undefined
						}
					/>
					<circle r='90' cx='110' cy='110' />
				</svg>
			</div>

			<div className={getClass(s.actions, s.actionsBottom)}>
				<span onClick={startOrPause}>{isActive ? <Pause /> : <Play />}</span>
				<span onClick={reset}>
					<Undo fill='#fff' />
				</span>
			</div>
		</div>
	)
}

const Timer = ({ maximized }: ICommonProps) => {
	const [timers, setTimers] = useState<Array<ITimer>>([{ name: 'Test', duration: 500 }])
	const { toggleModal, Modal } = useModal()

	return (
		<Fragment>
			<Modal title='Add New Timer'>
				{({ onSave }) => {
					const [name, setName] = useState<string>('')
					const [hours, setHours] = useState<number>(0)
					const [minutes, setMinutes] = useState<number>(0)
					const [seconds, setSeconds] = useState<number>(0)
					const [valueSelected, setValueSelected] = useState<SelectedValue>('hour')

					onSave.current = () => {
						const secondsToSave = seconds * 1000
						const minutesToSave = minutes * 60 * 1000
						const hoursToSave = hours * 60 * 60 * 1000

						setTimers((t) => [...t, { name, duration: (hoursToSave + minutesToSave + secondsToSave) / 10 }])
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
								<input
									type='text'
									value={name}
									className={m.timerInput}
									onChange={({ target }) => setName(target.value)}
								/>
							</div>
						</Fragment>
					)
				}}
			</Modal>

			<div className={s.timer}>
				{timers.map(({ name, duration }, key) => (
					<Counter key={key} name={name} duration={duration} maximized={maximized} />
				))}
			</div>

			<div title='New Timer' className={getClass('pointer', s.timerNew)} onClick={toggleModal}>
				<Plus />
			</div>
		</Fragment>
	)
}

export default Timer
