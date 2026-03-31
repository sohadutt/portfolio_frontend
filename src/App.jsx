import { useState, useEffect } from 'react'
import './style/App.css'

function App() {
  const [theme, setTheme] = useState('dark')
  
  useEffect(() =>{
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <>
    <button onClick={()=> setTheme(theme === 'dark' ? 'light' :'dark')}>
      Toggle theme
    </button>
    </>
  )
}

export default App
