import { useEffect, useState } from 'react'
import { getViewCount, goatcounterConfigured } from '../lib/goatcounter.js'
import './ViewCounter.css'

export default function ViewCounter({ path }) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    if (!goatcounterConfigured) return
    let cancelled = false
    getViewCount(path).then((c) => {
      if (!cancelled) setCount(c)
    })
    return () => {
      cancelled = true
    }
  }, [path])

  if (!count) return null

  return <span className="view-counter">{count} views</span>
}
