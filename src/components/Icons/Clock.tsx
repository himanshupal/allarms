import type { IIconProps } from '@/types/Icon'

const Clock = ({ width = 24, height = 24, fill = 'none', className }: Omit<IIconProps, 'currentColor'>) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill={fill}
			width={width}
			height={height}
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
		>
			<circle cx='12' cy='12' r='10' />
			<polyline points='12 6 12 12 16 14' />
		</svg>
	)
}

export default Clock
