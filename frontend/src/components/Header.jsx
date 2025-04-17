import { Button} from "flowbite-react"
import { Link } from "react-router-dom"
import { BiSearchAlt2 } from "react-icons/bi";
import {FaMoon, FaSun} from 'react-icons/fa'
import { useState } from "react";

function Header() {

  return (
    <div className="px-4 flex flex-wrap justify-between py-5  text-blue-800 shadow-sm">

       <Link to='/' className=" self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
         <span className="px-3 py-2 bg-gradient-to-r from-blue-700 to-gray-100 rounded-4xl  text-white">Subhin's Blog</span>
       </Link>

       <div className="mt-5 mx-auto order-2 md:mt-0 md:order-0 flex relative w-full md:max-w-96 max-w-4xl">
         <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"/>
         <BiSearchAlt2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
       </div>


        <div className="flex gap-2 items-center justify-center md:mr-20 md:gap-5  ">
          <Button className="w-12 h-11 bg-blue-300 text-white rounded-full border border-blue-300 hover:bg-white hover:text-blue-300 transition duration-500 p-3" pill>
            <FaMoon/>
          </Button>
          <Link to='/sign-in'>
            <Button className=" border border-blue-300 rounded-lg px-2 bg-blue-300 text-white hover:bg-white hover:text-blue-300 transition duration-500">Sign In</Button>
          </Link>
        </div>

    </div>
  )
}

export default Header
