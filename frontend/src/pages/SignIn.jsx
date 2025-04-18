import { Button, Label, TextInput,Alert, Spinner } from 'flowbite-react'
import { useState } from 'react'
import {Link} from 'react-router-dom'

function SignIn() {
  
  const [formData,setFormData] = useState({});
  
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    console.log(formData);
  }
  
    return (
      <div className="min-h-screen mt-20 p-5 flex flex-col md:flex-row">
  
        {/* left */}
  
        <div className="sm:m-20 flex-1">
          <Link to='/' className="self-center whitespace-nowrap text-xl sm:text-4xl font-semibold dark:text-white">
            <span className="px-3 py-2 bg-gradient-to-r from-blue-700 to-gray-100 rounded-4xl  text-white">Subhin's Blog</span>
          </Link>
          <p className='text-sm mt-5 font-semibold'>This is a demo site. You can sign-in here with your username and password. Feel free to check out our blogs.</p>
        </div>
  
        {/* Right */}
  
        <div className="mt-5 gap-5 flex-1 sm:ml-10 mr-10">
          <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
  
            <div>
              <Label value='username'/>
              <TextInput type='text' 
              placeholder='username' id='username' onChange={handleChange}/>
            </div>      
  
            <div>
              <Label value='Password'/>
              <TextInput type='password' placeholder='password' id='password' onChange={handleChange}/>
            </div>
      
            <Button className=' border border-blue-600 rounded-lg px-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 transition duration-500' type='submit'>Sign In</Button>
                    
          </form>
  
          <div className="text-sm flex gap-3 mt-3 font-semibold">
            <p>Don't have an account?</p>
            <Link to='/sign-up' className='text-blue-600'>Sign Up</Link>
          </div>
         
        </div>

      </div>
    )
  }
export default SignIn
