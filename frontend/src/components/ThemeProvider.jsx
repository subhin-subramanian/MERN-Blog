import React from 'react'
import { useSelector } from 'react-redux'

function ThemeProvider({children}) {
    const {theme} = useSelector(state=>state.theme)
    console.log(theme );
    
  return (
    <div className={theme}>
      <div className="bg-white text-blue-800 dark:text-blue-300 dark:bg-blue-950  min-h-screen">
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider
