import { Fragment } from 'react/jsx-runtime'

import { getClass, getElapsed } from '@/utils'

import s from './index.module.scss'

export interface ILap {
	slowest?: boolean
	fastest?: boolean
	diff: number
	ts: number
}

interface ILapTableProps {
	laps: Array<ILap>
}

const LapTable = ({ laps }: ILapTableProps) => {
	return (
		<div style={{ height: 400 }}>
			{!!laps.length && (
				<Fragment>
					<div className={getClass(s.lap, s.lapHeader)}>
						<span>Laps</span>
						<span>Time</span>
						<span>Total</span>
					</div>
					<div style={{ maxHeight: '100%', overflow: 'auto' }}>
						{laps.map(({ diff, ts, fastest, slowest }, idx) => {
							const { hours: eh, minutes: em, seconds: es, milliseconds: ems } = getElapsed(ts)
							const { hours: dh, minutes: dm, seconds: ds, milliseconds: dms } = getElapsed(diff)

							return (
								<div key={idx} className={s.lap}>
									<span>
										{laps.length - idx}
										{(fastest || slowest) && (
											<span style={{ marginLeft: 24 }}>
												{fastest && 'Fastest'}
												{slowest && 'Slowest'}
											</span>
										)}
									</span>
									<span>
										{dh}:{dm}:{ds}.{dms}
									</span>
									<span>
										{eh}:{em}:{es}.{ems}
									</span>
								</div>
							)
						})}
					</div>
				</Fragment>
			)}
		</div>
	)
}

export default LapTable
