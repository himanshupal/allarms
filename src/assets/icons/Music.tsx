import type { IIconProps } from '@/types/Icon'

const Music = ({ width = 24, height = 24, fill = '#fff', className }: Omit<IIconProps, 'currentColor'>) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={width} height={height} className={className}>
			<path fill='none' d='M0 0h24v24H0z' />
			<path d='M12 13.535V3h8v2h-6v12a4 4 0 1 1-2-3.465zM10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' fill={fill} />
		</svg>
	)
}

export default Music
