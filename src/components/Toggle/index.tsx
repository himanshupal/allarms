import { getClass } from '@/utils'
import { memo } from 'react'

import t from './index.module.scss'

interface IToggleProps {
	checked: boolean
	onToggle: VoidFunction
}

const Toggle: React.FC<IToggleProps> = memo(({ checked, onToggle }) => {
	return (
		<label className={getClass(t.toggle, 'pointer')}>
			<input type='checkbox' checked={checked} onChange={onToggle} />
			<span className={t.toggleSwitch} />
		</label>
	)
})

export default Toggle
