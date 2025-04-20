import { Button, TextInput } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'

function DashProfile() {

    const {currentUser} = useSelector(state=>state.user)
  return (
    <div className="py-10 mx-auto">
      <h1 className='font-bold text-3xl text-center'>Profile</h1>
      <form className="flex flex-col items-center gap-5">
        <div className="w-32 h-32 rounded-full mt-5 self-center cursor-pointer shadow-md" >
          <img src={currentUser.profilePic} alt="User" className="w-full h-full rounded-full border-3 " id="profilePic"/>
        </div>

        <TextInput className="w-80" type='text' defaultValue={currentUser.username} placeholder='username' id='username'/>

        <TextInput className="w-80"  type='email' defaultValue={currentUser.email} placeholder='email' id='email'/>

        <TextInput className="w-80"  type='password' placeholder='password' id='password'/>

        <Button className="w-80 bg-gradient-to-r from-blue-700 to-green-400"  type='submit'>Update</Button>
      </form>

      <div className="text-red-600 flex justify-center gap-40 mt-2 text-sm font-semibold">
        <span className='cursor-pointer'>Delete Account?</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      
    </div>
  )
}

export default DashProfile
