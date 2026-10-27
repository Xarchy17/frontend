import { useState, useEffect } from 'react'

export default function useStoredState(key, initial) {
  const [v, setV] = useState(initial)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) setV(JSON.parse(stored))
    } catch (error) {
      console.error(`Unable to read saved state "${key}".`, error)
    } finally {
      setLoaded(true)
    }
  }, [key])

  useEffect(() => {
    if (!loaded) return

    try {
      window.localStorage.setItem(key, JSON.stringify(v))
    } catch (error) {
      console.error(`Unable to save state "${key}".`, error)
    }
  }, [key, loaded, v])

  return [v, setV, loaded]
}
