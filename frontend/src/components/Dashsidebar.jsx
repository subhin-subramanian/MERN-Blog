import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiAnnotation,HiArrowSmRight,HiChartPie,HiDocumentText,HiOutlineUserGroup,HiUser } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

function Dashsidebar() {

    const location = useLocation();
    const [tab,setTab] = useState();
    const {currentUser} = useSelector(state=>state.user);

    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const tabUrl = urlParams.get('tab');
      if(tabUrl){
        setTab(tabUrl);
      }
    },[location.search])
  return (
    <Sidebar className='w-full'>
      <SidebarItems>
        <SidebarItemGroup>
          {currentUser.isAdmin &&
          <Link to={'/dashboard?tab=dash'}>
            <SidebarItem active={tab === 'dash' || !tab} icon={HiChartPie} as="div">DashBoard</SidebarItem>  
          </Link>}
          
          <Link to={'/dashboard?tab=profile'}>
            <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} as="div">Profile</SidebarItem>  
          </Link>
          {currentUser.isAdmin &&
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

          <SidebarItem icon={HiArrowSmRight} className='cursor-pointer'>Sign Out</SidebarItem>  

        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

export default Dashsidebar
