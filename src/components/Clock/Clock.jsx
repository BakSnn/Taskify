import { useEffect, useState } from 'react'
import styles from './Clock.module.scss'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const formatedTime = time.toLocaleTimeString()

  return (
    <div>
      <h1 className={styles.clock}>{formatedTime}</h1>
    </div>
  )
}

export default Clock
