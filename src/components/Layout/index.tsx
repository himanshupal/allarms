import { Hash } from '@/config'
import { StateUpdater } from 'preact/hooks'
import type { JSXInternal } from 'preact/src/jsx'
import s from './styles.module.scss'

interface ILayoutProps {
  children: JSXInternal.Element
  setHash: StateUpdater<Hash>
}

const Layout = ({ children, setHash }: ILayoutProps) => {
  return (
    <div className={s.container}>
      <aside className={s.sidebar}>
        <a className={s.link} href='/#/timer' onClick={() => setHash('#/timer')}>
          Timer
        </a>
        <a className={s.link} href='/#/alarm' onClick={() => setHash('#/alarm')}>
          Alarm
        </a>
        <a className={s.link} href='/#/stopwatch' onClick={() => setHash('#/stopwatch')}>
          StopWatch
        </a>
      </aside>

      <section className={s.content}>{children}</section>
    </div>
  )
}

export default Layout
