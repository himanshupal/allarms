import { useEffect, useState } from 'preact/hooks'
import { Hash, THEME_STORAGE_KEY } from '@/config'
import Stopwatch from '@/components/Stopwatch'
import Layout from '@/components/Layout'
import Timer from '@/components/Timer'
import Alarm from '@/components/Alarm'
import { Theme } from '@/types/Theme'
import { render } from 'preact'

import '@/styles/main.scss'

const App = function () {
  const [theme, setTheme] = useState<Theme>(Theme.ONE)
  const [hash, setHash] = useState<Hash>('#/alarm')

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    const themeToUse = savedTheme || String(theme)

    window.document.body.setAttribute(THEME_STORAGE_KEY, themeToUse)
    window.localStorage.setItem(THEME_STORAGE_KEY, themeToUse)
  }, [theme])

  useEffect(() => {
    setHash(window.location.hash as Hash)
  }, [window.location.hash])

  const Component = {
    '#/alarm': Alarm,
    '#/timer': Timer,
    '#/stopwatch': Stopwatch,
  }[hash]

  return (
    <Layout setHash={setHash}>
      <Component />
    </Layout>
  )
}

render(<App />, document.getElementById('app')!)
