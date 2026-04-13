import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme'
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'
const isThemeName = (theme) => theme === 'light' || theme === 'dark'

function getPreferredTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY)

  if (isThemeName(savedTheme)) {
    return savedTheme
  }

  return window.matchMedia(DARK_SCHEME_QUERY).matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getPreferredTheme)
  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia(DARK_SCHEME_QUERY)

    function handleChange(event) {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY)
      if (!savedTheme) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return {
    theme,
    mounted: true,
    setTheme,
    toggleTheme,
  }
}
