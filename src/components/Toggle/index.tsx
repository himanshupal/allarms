import { getClass } from '@/utils'

import t from './toggle.module.scss'

interface IToggleProps {
	checked: boolean
	onToggle: VoidFunction
}

const Toggle: React.FC<IToggleProps> = ({ checked, onToggle }) => {
	return (
		<label className={getClass(t.toggle, 'pointer')}>
			<input type='checkbox' checked={checked} onChange={onToggle} />
			<span className={t.toggleSwitch} />
		</label>
	)
}

export default Toggle
