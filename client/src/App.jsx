import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Projects from './Pages/Projects'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import About from './Pages/About'
import Header from './Components/Header'

function App() {
  return (
   <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='projects' element={<Projects/>}/>
      <Route path='sign-in' element={<SignIn/>}/>
      <Route path='sign-up' element={<SignUp/>}/> 
      <Route path='about' element={<About/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App
