import type { IIconProps } from '@/types/Icon'

const Cancel = ({
	width = 24,
	height = 24,
	fill = '#000',
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
			<line x1='18' y1='6' x2='6' y2='18' />
			<line x1='6' y1='6' x2='18' y2='18' />
		</svg>
	)
}

export default Cancel
