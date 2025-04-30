import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem} from "flowbite-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BiSearchAlt2 } from "react-icons/bi";
import {FaMoon,FaSun} from 'react-icons/fa'
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { signOutFailure, signOutSuccess } from "../redux/userSlice";
import { useEffect, useState } from "react";

function Header() {

  const {currentUser} = useSelector(state=>state.user);
  const dispatch = useDispatch();
  const {theme} = useSelector(state=>state.theme);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm,setSearchTerm] = useState('');

  // Getting the queries in search window
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    setSearchTerm(searchTermFromUrl);
  },[location.search]);

  // Function to go to search page when hit search button
  const handleSearchSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  // Function for signing out
  const handleSignOut = async()=>{
    try {
      const response = await fetch(`/api/user/sign-out`,{method:'POST'});
      const data = await response.json();
      if(!response.ok){
        console.log(data.message);
      }else{
        dispatch(signOutSuccess(data));
        navigate('/sign-up');
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
      console.log(error.message);
    }
  }

  return (
    <div className="px-4 flex flex-wrap justify-between py-5  text-blue-800 shadow-sm dark:shadow-2xl">

       <Link to='/' className=" self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
         <span className="px-3 py-2 bg-gradient-to-r from-blue-700 to-gray-100 rounded-4xl  text-white">Subhin's Blog</span>
       </Link>

       <form onSubmit={handleSearchSubmit} className="mt-5 mx-auto order-2 md:mt-0 md:order-0 flex relative w-full md:max-w-96 max-w-4xl">
         <input
            type="text"
            placeholder="Search..."
            
            onChange={(e)=>setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-blue-300"/>
         <BiSearchAlt2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
       </form>


        <div className="flex gap-2 items-center justify-center md:mr-20 md:gap-5  ">
          <Button className="w-12 h-11 bg-blue-300 text-white rounded-full border border-blue-300 hover:bg-white hover:text-blue-300 p-3" pill onClick={()=>dispatch(toggleTheme())}>
            {theme === 'light'? <FaMoon/> : <FaSun/>}
          </Button>

          {currentUser ? (
            <Dropdown arrowIcon={false} inline 
            label={<Avatar alt="user" img={currentUser.profilePic} rounded/>}>

             <DropdownHeader>
               <span className="block text-sm">@{currentUser.username}</span>
               <span className="block text-sm font-medium truncate pt-1">{currentUser.email}</span>
             </DropdownHeader>

             <Link to={'/dashboard?tab=profile'}>
              <DropdownItem>Profile</DropdownItem>
             </Link>

             <DropdownDivider/>
             <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
            </Dropdown>

          ):(
            <Link to='/sign-in'>
             <Button className=" border border-blue-300 rounded-lg px-2 bg-blue-300 text-white hover:bg-white hover:text-blue-300 transition duration-500">Sign In</Button>
            </Link>
          )}         
        </div>

    </div>
  )
}

export default Header
