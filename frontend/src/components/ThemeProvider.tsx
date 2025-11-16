import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({children}:ThemeProviderProps) {
    const {theme} = useSelector((state: RootState)=>state.theme);
    
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
