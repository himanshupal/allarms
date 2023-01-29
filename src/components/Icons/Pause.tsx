import type { IIconProps } from '@/types/Icon'

const Pause = ({ width = 24, height = 24, fill = '#000', className }: Omit<IIconProps, 'currentColor'>) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={width} height={height} className={className}>
			<path fill='none' d='M0 0h24v24H0z' />
			<path fill={fill} d='M6 5h2v14H6V5zm10 0h2v14h-2V5z' />
		</svg>
	)
}

export default Pause
