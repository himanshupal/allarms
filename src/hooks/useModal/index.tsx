import { Cancel, Save } from '@/components/Icons'
import { memo, useRef, useState } from 'react'
import { getClass } from '@/utils'

import s from './styles.module.scss'

interface IModalContent {
	onSave: React.MutableRefObject<VoidFunction | null>
	onCancel: React.MutableRefObject<VoidFunction | null>
}

interface IModalProps {
	children: React.FC<IModalContent>
	title: string
}

const useModal = () => {
	const [modalActive, setModalActive] = useState<boolean>(true)

	const toggleModal = () => setModalActive((a) => !a)

	const Modal = memo(({ title, children }: IModalProps) => {
		const onSave = useRef<VoidFunction | null>(null)
		const onCancel = useRef<VoidFunction | null>(null)

		const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault()
			onSave.current?.()
			toggleModal()
		}

		const onReset: React.FormEventHandler<HTMLFormElement> = (e) => {
			e.preventDefault()
			onCancel.current?.()
			toggleModal()
		}

		return !modalActive ? null : (
			<div className={s.modal} onClick={(e) => e.target === e.currentTarget && toggleModal()}>
				<form className={s.modalContent} onSubmit={onSubmit} onReset={onReset}>
					<div className={s.modalTitle}>{title}</div>
					{children({ onSave, onCancel })}
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

	return { toggleModal, Modal }
}

export default useModal
