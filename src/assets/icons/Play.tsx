import type { IIconProps } from '@/types/Icon'

const Play = ({ width = 24, height = 24, fill = '#000', className }: Omit<IIconProps, 'currentColor'>) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={width} height={height} className={className}>
			<path fill='none' d='M0 0h24v24H0z' />
			<path
				fill={fill}
				d='M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z'
			/>
		</svg>
	)
}

export default Play
