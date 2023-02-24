export type Meridian = 'AM' | 'PM'
export type Day = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa'

export interface IChime {
	id: string
	title: string
	media: string
}

export interface IInterval {
	id: string
	title: string
	value: number
}

export interface IAlarm {
	endAt: { hour: number; minute: number; phase: Meridian }
	snoozeDuration: number
	repeatOn: Array<Day>
	isActive: boolean
	chime: IChime
	title: string
	id: string
}
