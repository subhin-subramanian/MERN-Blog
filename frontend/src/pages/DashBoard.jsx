import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import Dashsidebar from "../components/Dashsidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashBoardComp from "../components/DashBoardComp";

function DashBoard() {

  const location = useLocation();
  const [tab,setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get('tab');
    if(tabUrl){
      setTab(tabUrl);
    }

  },[location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* sidebar */}
      <div className="md:w-60">
        <Dashsidebar/>
      </div>

      {/* DashBoardComp */}
      {tab === 'dash  ' && <DashBoardComp/>} 

      {/* Profile */}
      {tab === 'profile' && <DashProfile/>}

      {/* Posts */}
      {tab === 'posts' && <DashPosts/>}

      {/* Users */}
      {tab === 'users' && <DashUsers/>}

      {/* Comments */}
      {tab === 'comments' && <DashComments/>}

    </div>
  )
}

export default DashBoard
