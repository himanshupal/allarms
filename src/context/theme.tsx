import { DefaultTheme, ThemeProvider } from 'styled-components'
import { StateUpdater, useState } from 'preact/hooks'
import { createContext } from 'preact'

export enum Theme {
  ONE,
  TWO,
  THREE
}

export interface IThemeContext {
  theme: Theme
  setTheme: StateUpdater<Theme>
}

export const ThemeContext = createContext<IThemeContext>({
  theme: Theme.ONE,
  setTheme(t) {}
})

export const WithTheme = ({ children }: { children: JSX.Element }) => {
  const [theme, setTheme] = useState<Theme>(Theme.ONE)

  const themes: Record<Theme, DefaultTheme> = {
    [Theme.ONE]: {},
    [Theme.TWO]: {},
    [Theme.THREE]: {}
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
