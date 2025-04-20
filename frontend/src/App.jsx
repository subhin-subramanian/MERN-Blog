import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignIn from "./pages/SignIn"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Header from "./components/Header"
import DashBoard from "./pages/DashBoard"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import FooterComp from "./components/FooterComp"
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/post-page" element={<PostPage/>}/>
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/create-post" element={<CreatePost/>}/>
        <Route path="/update-post" element={<UpdatePost/>}/>
      </Routes>
      <FooterComp/>
    </BrowserRouter>
  )
}

export default App
