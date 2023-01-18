export const getClass = (...classNames: Array<string | false | undefined>) => classNames.filter((_) => _).join(' ')

export const padZero = (n: number, digits: number = 2) => String(n > 0 ? n : 0).padStart(digits, '0')

export const getElapsed = (ts: number) => ({
	hours: padZero(~~((ts / 100 / 60 / 60) % 60)),
	minutes: padZero(~~((ts / 100 / 60) % 60)),
	seconds: padZero(~~((ts / 100) % 60)),
	milliseconds: padZero(~~(ts % 100)),
})
