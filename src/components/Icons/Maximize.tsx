import { IIconProps } from '@/types/Icon'

const Maximize = ({ width = 24, height = 24, fill = 'none', stroke = 'currentColor', className }: IIconProps) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			fill={fill}
			stroke={stroke}
			stroke-width='2'
			viewBox='0 0 24 24'
			stroke-linecap='round'
			stroke-linejoin='round'
			className={className}
		>
			<polyline points='15 3 21 3 21 9' />
			<polyline points='9 21 3 21 3 15' />
			<line x1='21' y1='3' x2='14' y2='10' />
			<line x1='3' y1='21' x2='10' y2='14' />
		</svg>
	)
}

export default Maximize
