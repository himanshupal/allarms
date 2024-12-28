import { Cancel, Delete, Save } from '@/assets/icons'
import { getClass } from '@/utils'
import { memo, useRef, useState } from 'react'

import s from './index.module.scss'

interface IModalContent {
	onSave: React.RefObject<VoidFunction | null>
	onCancel: React.RefObject<VoidFunction | null>
	onDelete: React.RefObject<VoidFunction | null>
	toggleModal: VoidFunction
}

export interface IModalProps {
	children(props: IModalContent): React.ReactNode
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
