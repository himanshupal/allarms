import type { Dispatch, SetStateAction } from 'react'

export interface ICommonProps {
	setMaximized: Dispatch<SetStateAction<boolean>>
	maximized: boolean
}
