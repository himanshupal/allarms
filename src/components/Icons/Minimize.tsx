import type { IIconProps } from '@/types/Icon'

const Minimize = ({ width = 24, height = 24, fill = 'none', stroke = 'currentColor', className }: IIconProps) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 24 24'
			fill={fill}
			stroke={stroke}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
		>
			<polyline points='4 14 10 14 10 20' />
			<polyline points='20 10 14 10 14 4' />
			<line x1='14' y1='10' x2='21' y2='3' />
			<line x1='3' y1='21' x2='10' y2='14' />
		</svg>
	)
}

export default Minimize
