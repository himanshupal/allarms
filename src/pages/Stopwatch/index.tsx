import { Fragment, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Flag, Maximize, Minimize, Pause, Play, Undo } from '@/assets/icons'
import useStore from '@/store'
import { getClass, getElapsed } from '@/utils'

import type { ILap } from './LapTable'
import LapTable from './LapTable'
import s from './index.module.scss'

const Stopwatch = () => {
	const [isActive, setActive] = useState<boolean>(false)
	const [timer, setTimer] = useState<NodeJS.Timeout>()
	const [laps, setLaps] = useState<Array<ILap>>([])
	const [elapsed, setElapsed] = useState<number>(0)
	const { maximized, toggleMaximized } = useStore()

	const { hours, minutes, seconds, milliseconds } = useMemo(() => getElapsed(elapsed), [elapsed])

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

	const recordLap = () => {
		if (!isActive) return
		setLaps((c) => {
			// First iteration
			if (!c.length) {
				return [{ diff: elapsed, ts: elapsed }]
			}

			const [previous] = c
			const diff = elapsed - previous.ts
			const fastest = c.find((l) => l.fastest)
			const slowest = c.find((l) => l.slowest)

			// Second iteration
			if (!(fastest && slowest)) {
				const isFaster = diff < previous.diff
				return [
					{ diff, ts: elapsed, [isFaster ? 'fastest' : 'slowest']: true },
					{ ...previous, [isFaster ? 'slowest' : 'fastest']: true },
				]
			}

			const isFastest = diff <= fastest.diff
			const isSlowest = diff >= slowest.diff

			// N-th iteration
			return [
				{ ts: elapsed, diff, ...(isFastest ? { fastest: true } : isSlowest ? { slowest: true } : undefined) },
				...c.map((l) => {
					if (l.fastest && isFastest) l.fastest = false
					if (l.slowest && isSlowest) l.slowest = false
					return l
				}),
			]
		})
	}

	const reset = () => {
		clearInterval(timer)
		setActive(false)
		setElapsed(0)
		setLaps([])
	}

	return (
		<Fragment>
			<Helmet>
				<title>Stopwatch</title>
			</Helmet>

			<div className={s.wrapper}>
				<div className={getClass(s.icons, s.iconsTop)}>
					<span onClick={toggleMaximized}>{maximized ? <Minimize /> : <Maximize />}</span>
				</div>

				<div className={getClass(s.timer, isActive && s.timerActive, maximized && s.maximized)}>
					<div className={s.timerValue}>
						<span>
							{hours}
							<span>:</span>
						</span>
						<span>hr</span>
					</div>

					<div className={s.timerValue}>
						<span>
							{minutes}
							<span>:</span>
						</span>
						<span>min</span>
					</div>

					<div className={s.timerValue}>
						<span>
							{seconds}
							<span>.</span>
						</span>
						<span>sec</span>
					</div>

					<div className={s.timerValue}>
						<span>{milliseconds}</span>
					</div>
				</div>

				<div className={getClass(s.icons, s.iconsBottom)}>
					<span onClick={startOrPause}>{isActive ? <Pause /> : <Play />}</span>

					{!maximized && (
						<span onClick={recordLap}>
							<Flag fill={isActive ? '#fff' : '#797b84'} />
						</span>
					)}

					<span onClick={reset}>
						<Undo fill='#fff' />
					</span>
				</div>

				{!maximized && <LapTable laps={laps} />}
			</div>
		</Fragment>
	)
}

export default Stopwatch
