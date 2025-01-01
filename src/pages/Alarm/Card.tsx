import dayjs, { type Dayjs } from 'dayjs'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Clock, Edit } from '@/assets/icons'
import Toggle from '@/components/Toggle'
import { SHAKE_ANIM_DURATION } from '@/config'
import useModal from '@/hooks/useModal'
import type { IAlarm } from '@/types/Alarm'
import { getClass, padZero } from '@/utils'

import AlarmModal, { days } from './Modal'
import s from './index.module.scss'

interface IAlarmCardProps extends IAlarm {
	toggleActive: (id: IAlarm['id']) => void
}

const Card = ({
	id,
	endAt,
	title,
	chime,
	repeatOn,
	isActive,
	toggleActive,
	repeatEnabled,
	snoozeDuration,
}: IAlarmCardProps) => {
	const { hour, minute, phase } = endAt

	const getEndsOn = useCallback(() => {
		let endAtHour = hour === 12 ? 0 : hour
		if (phase === 'PM') endAtHour += 12
		let endsOn = dayjs().set('hour', endAtHour).set('minute', minute)
		if (endsOn.isBefore(dayjs())) endsOn = endsOn.add(1, 'day')
		return endsOn
	}, [hour, minute, phase])

	const { isModalActive, Modal, toggleModal } = useModal()

	const [endsOn, setEndsOn] = useState<Dayjs>(getEndsOn())
	const [ringing, setRinging] = useState<boolean>(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [timer, setTimer] = useState<NodeJS.Timeout>()
	const notificationSent = useRef<boolean>(false)

	const secondsLeft = useMemo(() => endsOn.unix() - dayjs().unix(), [endsOn])
	const hoursLeft = useMemo(() => Math.floor(secondsLeft / 60 / 60), [secondsLeft])
	const minutesLeft = useMemo(() => Math.floor((secondsLeft / 60) % 60), [secondsLeft])
	const isRinging = !(hoursLeft || minutesLeft)

	const initiateTimer = () => setTimer(setInterval(updateEndsOn, 100))
	const updateEndsOn = () => setEndsOn(getEndsOn())
	const toggleAlarm = () => toggleActive(id)

	useEffect(() => {
		if (isRinging) {
			setRinging(true)
			if (!notificationSent.current) {
				new Notification(`Alarm Ringing - ${title}`)
				notificationSent.current = true
			}
			const handler = setTimeout(() => setRinging(false), SHAKE_ANIM_DURATION)
			return () => clearTimeout(handler)
		}
	}, [isRinging])

	useEffect(() => {
		if (!timer) return
		if (!hoursLeft && !minutesLeft) {
			clearInterval(timer)
			if (isActive) audioRef.current?.play()
			else {
				notificationSent.current = false
				initiateTimer()
			}
		}
	}, [hoursLeft, minutesLeft])

	useEffect(() => {
		// if (isActive) initiateTimer()
		// if (isModalActive || !isActive) clearInterval(timer)

		if (isModalActive) clearInterval(timer)
		else initiateTimer()

		audioRef.current?.addEventListener('ended', initiateTimer)
		return () => {
			clearInterval(timer)
			audioRef.current?.removeEventListener('ended', initiateTimer)
		}
	}, [isActive, isModalActive])

	return (
		<Fragment>
			<AlarmModal
				id={id}
				Modal={Modal}
				defaultValues={{ title, chime, hour, minute, phase, repeatOn, repeatEnabled, interval: snoozeDuration }}
			/>

			<div className={getClass(s.alarmCard, isActive && s.alarmCardActive, ringing && 'shaking')}>
				<audio ref={audioRef} src={chime.media} />
				<div className={s.alarmCardEndTimeContainer}>
					<div className={s.alarmCardEndTime}>
						{padZero(hour)}:{padZero(minute)}
						<span>{phase}</span>
					</div>
					<span className={s.alarmIcons}>
						<span className={getClass('pointer', s.alarmIcon)} onClick={toggleModal}>
							<Edit />
						</span>
						<Toggle checked={isActive} onToggle={toggleAlarm} />
					</span>
				</div>
				<div className={s.alarmCardTimeLeft}>
					<Clock width={14} height={14} />
					{isRinging ? `Ringing...` : `Rings in ${hoursLeft} hours, ${minutesLeft} minutes`}
				</div>
				<div className={s.alarmCardTitle}>{title}</div>
				<div className={s.alarmCardDayRow}>
					{days.map((day) => (
						<div
							key={day}
							className={getClass(s.alarmDay, repeatEnabled && repeatOn.includes(day) && s.alarmDayActive)}
						>
							{day}
						</div>
					))}
				</div>
			</div>
		</Fragment>
	)
}

export default Card
