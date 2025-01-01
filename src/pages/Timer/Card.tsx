import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'

import { Edit, Maximize, Minimize, Pause, Play, Undo } from '@/assets/icons'
import { SHAKE_ANIM_DURATION } from '@/config'
import useModal from '@/hooks/useModal'
import useStore from '@/store'
import type { ITimer } from '@/types/Timer'
import { getClass, getElapsed } from '@/utils'

import TimerModal from './Modal'
import s from './index.module.scss'

export interface ICounterProps extends ITimer {
	setMaximizedCounter: React.Dispatch<React.SetStateAction<ITimer['id'] | undefined>>
}

const Card = ({ id, name, duration, setMaximizedCounter }: ICounterProps) => {
	const { maximized, toggleMaximized } = useStore()

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
			<Helmet>
				<title>Timer</title>
			</Helmet>

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
							onClick={() => (setMaximizedCounter(maximized ? undefined : id), toggleMaximized())}
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

export default Card
