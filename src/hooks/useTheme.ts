import { ThemeContext } from '@/context/theme'
import { useContext } from 'preact/hooks'

export const useTheme = () => useContext(ThemeContext)
