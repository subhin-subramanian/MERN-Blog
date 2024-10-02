import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Projects from './Pages/Projects'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import Home from './Pages/Home'
import Profile from './Pages/Profile'

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='projects' element={<Projects/>}/>
      <Route path='sign-in' element={<SignIn/>}/>
      <Route path='sign-up' element={<SignUp/>}/> 
    </Routes>
   </BrowserRouter>
  )
}

export default App
