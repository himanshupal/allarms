import type { Table } from 'dexie'
import Dexie from 'dexie'

import type { IAlarm } from '@/types/Alarm'
import type { ITimer } from '@/types/Timer'

class Database extends Dexie {
	public timers!: Table<ITimer, string>
	public alarms!: Table<IAlarm, string>

	public constructor() {
		super('userData')
		this.version(1).stores({
			timers: 'id',
			alarms: 'id',
		})
	}
}

export default new Database()
