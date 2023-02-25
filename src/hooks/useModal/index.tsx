import { Cancel, Delete, Save } from '@/components/Icons'
import { memo, useRef, useState } from 'react'
import { getClass } from '@/utils'

import s from './styles.module.scss'

interface IModalContent {
	onSave: React.MutableRefObject<VoidFunction | null>
	onCancel: React.MutableRefObject<VoidFunction | null>
	onDelete: React.MutableRefObject<VoidFunction | null>
	toggleModal: VoidFunction
}

export interface IModalProps {
	children: React.FC<IModalContent>
	showDeleteIcon?: boolean
	title: string
}

const useModal = () => {
	const [isModalActive, setModalActive] = useState<boolean>(false)

	const toggleModal = () => setModalActive((a) => !a)

	const Modal = memo(({ title, children, showDeleteIcon }: IModalProps) => {
		const onSave = useRef<VoidFunction | null>(null)
		const onCancel = useRef<VoidFunction | null>(null)
		const onDelete = useRef<VoidFunction | null>(null)

		const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault()
			onSave.current?.()
		}

		const onReset: React.FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault()
			onCancel.current?.()
			toggleModal()
		}

		return !isModalActive ? null : (
			<div className={s.modal} onClick={(e) => e.target === e.currentTarget && toggleModal()}>
				<form className={s.modalContent} onSubmit={onSubmit} onReset={onReset}>
					<div className={s.modalTitle}>
						{title}
						{showDeleteIcon && (
							<span className='pointer' onClick={() => onDelete.current?.()}>
								<Delete />
							</span>
						)}
					</div>
					{children({ onSave, onCancel, onDelete, toggleModal })}
					<div className={s.modalActions}>
						<button className={getClass('pointer', s.modalActionsButton, s.modalActionsSave)} type='submit'>
							<Save /> Save
						</button>
						<button className={getClass('pointer', s.modalActionsButton, s.modalActionsCancel)} type='reset'>
							<Cancel /> Cancel
						</button>
					</div>
				</form>
			</div>
		)
	})

	return { isModalActive, toggleModal, Modal }
}

export default useModal
