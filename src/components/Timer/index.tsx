import { Maximize, Minimize, Pause, Play, Undo } from '@/components/Icons'
import type { ICommonProps } from '@/types/Common'
import { useMemo, useState } from 'react'
import { getClass, getElapsed } from '@/utils'

import s from './styles.module.scss'

interface ICounterProps {
	maximized: boolean
}

const Counter = ({ maximized }: ICounterProps) => {
	const [isActive, setActive] = useState<boolean>(false)
	const [timer, setTimer] = useState<NodeJS.Timer>()
	const [elapsed, setElapsed] = useState<number>(0)

	const { hours, minutes, seconds } = useMemo(() => getElapsed(elapsed), [elapsed])

	const startOrPause = () => {
		if (isActive) {
			clearInterval(timer)
			setActive(false)
		} else {
			const _timer = setInterval(() => {
				setElapsed((e) => e + 1)
			}, 10)
			setActive(true)
			setTimer(_timer)
		}
	}

	const reset = () => {
		clearInterval(timer)
		setActive(false)
		setElapsed(0)
	}

	return (
		<div className={s.timerCard}>
			<div className={getClass(s.actions, s.actionsTop)}>
				<span>10 min</span>
				{maximized ? <Minimize /> : <Maximize />}
			</div>

			<div className={getClass(s.timerRingContainer)}>
				<span className={getClass(s.timerDigits, isActive && s.timerDigitsActive)}>
					{`${hours}:${minutes}:${seconds}`}
				</span>
				<svg width='220' height='220' className={getClass(s.timerRing, isActive && s.timerRingActive)}>
					<circle r='110' cx='110' cy='110' />
					<circle r='100' cx='110' cy='110' style={{ strokeDasharray: '314 628' }} />
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
	return (
		<div className={s.timer}>
			<Counter maximized={maximized} />
			<Counter maximized={maximized} />
			<Counter maximized={maximized} />
			<Counter maximized={maximized} />
		</div>
	)
}

export default Timer
