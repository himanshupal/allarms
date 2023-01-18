import { IIconProps } from '@/types/Icon'

const Flag = ({ width = 24, height = 24, fill = '#000', className }: Omit<IIconProps, 'currentColor'>) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={width} height={height} className={className}>
			<path fill='none' d='M0 0h24v24H0z' />
			<path
				fill={fill}
				d='M3 3h9.382a1 1 0 0 1 .894.553L14 5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6.382a1 1 0 0 1-.894-.553L12 16H5v6H3V3z'
			/>
		</svg>
	)
}

export default Flag