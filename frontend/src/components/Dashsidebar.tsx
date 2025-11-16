import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiAnnotation,HiArrowSmRight,HiChartPie,HiDocumentText,HiOutlineUserGroup,HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOutFailure, signOutSuccess } from '../redux/userSlice';
import { RootState } from '../redux/store';

function Dashsidebar() {

    const location = useLocation();
    const [tab,setTab] = useState <string> ('');
    const {currentUser} = useSelector((state : RootState)=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const tabUrl = urlParams.get('tab');
      if(tabUrl){
        setTab(tabUrl);
      }
    },[location.search])

      
    // Function for signing out
    const handleSignOut = async()=>{
      try {
        const response = await fetch(`/api/user/sign-out`,{method:'POST'});
        const data = await response.json();
        if(!response.ok){
          console.log(data.message);
        }else{
          dispatch(signOutSuccess(data.message));
          navigate('/sign-up');
        }
      } catch (error:any) {
        dispatch(signOutFailure(error.message));
        console.log(error.message);
      }
    }

  return (
    <Sidebar className='w-full'>
      <SidebarItems>
        <SidebarItemGroup>
          {currentUser?.isAdmin &&
          <Link to={'/dashboard?tab=dash'}>
            <SidebarItem active={tab === 'dash' || !tab} icon={HiChartPie} as="div">DashBoard</SidebarItem>  
          </Link>}
          
          <Link to={'/dashboard?tab=profile'}>
            <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser?.isAdmin ? 'Admin' : 'User'} as="div">Profile</SidebarItem>  
          </Link>
          {currentUser?.isAdmin &&
          <>
          <Link to={'/dashboard?tab=posts'}>
            <SidebarItem active={tab === 'posts'} icon={HiDocumentText}  as="div">Posts</SidebarItem>  
          </Link>

          <Link to={'/dashboard?tab=users'}>
            <SidebarItem active={tab === 'users'} icon={HiOutlineUserGroup} as="div">Users</ SidebarItem>  
          </Link>

          <Link to={'/dashboard?tab=comments'}>
            <SidebarItem active={tab === 'comments'} icon={HiAnnotation}  as="div">Comments</ SidebarItem>  
          </Link>
          </>}

          <SidebarItem icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>Sign Out</SidebarItem>  

        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

export default Dashsidebar
