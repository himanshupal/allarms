import type { ITimer } from '@/types/Timer'
import type { Table } from 'dexie'
import Dexie from 'dexie'

class Database extends Dexie {
	public timers!: Table<ITimer, string>

	public constructor() {
		super('userData')
		this.version(1).stores({
			timers: 'id,name,duration',
		})
	}
}

export default new Database()
