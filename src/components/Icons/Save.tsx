import type { IIconProps } from '@/types/Icon'

const Save = ({
	width = 24,
	height = 24,
	fill = 'none',
	stroke = 'currentColor',
	className,
	strokeWidth = 1,
}: IIconProps & { strokeWidth?: number }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 24 24'
			fill={fill}
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
		>
			<path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' />
			<polyline points='17 21 17 13 7 13 7 21' />
			<polyline points='7 3 7 8 15 8' />
		</svg>
	)
}

export default Save
