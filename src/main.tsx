import { WithTheme } from '@/context/theme'
import { render } from 'preact'
import { App } from './app'

render(
  <WithTheme>
    <App />
  </WithTheme>,
  document.getElementById('app')!
)
