import { create } from 'zustand'

interface IStore {
	maximized: boolean
	toggleMaximized: () => void
}

const useStore = create<IStore>((set) => ({
	maximized: false,
	toggleMaximized() {
		return set(({ maximized }) => ({ maximized: !maximized }))
	},
}))

export default useStore
