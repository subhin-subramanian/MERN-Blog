import React from 'react'
import { useSelector } from 'react-redux'

function ThemeProvider({children}) {
    const {theme} = useSelector(state=>state.theme);
    
  return (
    <div className={theme}>
      {/* <div className="bg-gradient-to-r from-blue-400 to-white dark:from-blue-800 dark:to-blue-900">
      {children}    
      </div> */}
      <div className="bg-white text-blue-800 dark:text-blue-300 dark:bg-blue-950  min-h-screen">
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider
