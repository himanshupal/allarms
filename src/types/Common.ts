import { StateUpdater } from 'preact/hooks'

export interface ICommonProps {
	setMaximized: StateUpdater<boolean>
	maximized: boolean
}
