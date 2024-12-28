import type { IIconProps } from '@/types/Icon'

const Chevron = {
	Up({ width = 24, height = 24, fill = 'none', stroke = 'currentColor', className }: IIconProps) {
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
				<polyline points='18 15 12 9 6 15'></polyline>
			</svg>
		)
	},
	Down({ width = 24, height = 24, fill = 'none', stroke = 'currentColor', className }: IIconProps) {
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
				<polyline points='6 9 12 15 18 9'></polyline>
			</svg>
		)
	},
}

export default Chevron
