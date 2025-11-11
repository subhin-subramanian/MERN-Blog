import { Button, Label, TextInput,Alert, Spinner } from 'flowbite-react'
import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {GoogleLogin } from '@react-oauth/google';

const SignUp = () => {

  const [formData,setFormData] = useState({});
  const [errorMsg,setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setErrorMsg(null)
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMsg("All fields are required")
    }
    try {
      setLoading(true)
      setErrorMsg(false)
      const response = await fetch('/api/user/sign-up',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success === false){
        console.log(data.message)
        setLoading(false)
        return setErrorMsg(data.message)
      }
      setLoading(false)
      if(response.ok){
        navigate('/sign-in')
      }

    } catch (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async(credentialResponse)=>{
    setErrorMsg(null)
    if(!formData.password || formData.password==='') {
     return setErrorMsg("Even if you're using google account to signup, password is required. Please enter a password");
    } 
    let password = formData.password;
    try {
      setLoading(true)
      setErrorMsg(false)
      const response = await fetch('/api/user/sign-up/google',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({token : credentialResponse.credential,password})
      });
      const data = await response.json();
      if (!response.ok){
        console.log(data.message)
        setLoading(false)
        return setErrorMsg(data.message)
      }
      setLoading(false)
      navigate('/sign-in')
    } catch (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen mt-20 p-5 flex flex-col md:flex-row">

      {/* left */}

      <div className="sm:m-20 flex-1">
        <Link to='/' className="self-center whitespace-nowrap text-xl sm:text-4xl font-semibold dark:text-white">
          <span className="px-3 py-2 bg-gradient-to-r from-blue-700 to-gray-100 rounded-4xl  text-white">Subhin's Blog</span>
        </Link>
        <p className='text-sm mt-5 font-semibold'>This is a demo site. You can sign-up here with an email and password. Feel free to check out our blogs.</p>
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
            <Label value='Email' className=''/>
            <TextInput type='email' placeholder='email' id='email' onChange={handleChange}/>
          </div>

          <div>
            <Label value='Password'/>
            <TextInput type='password' placeholder='password' id='password' onChange={handleChange}/>
          </div>
    
          <Button className=' border border-blue-600 rounded-lg px-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 transition duration-500' type='submit'disabled={loading}>
            {loading ?(
              <>
               <Spinner size='sm'/>
                <span className='pl-'>Loading...</span>
              </>
            ) :('Sign Up')}</Button>    
            
            <GoogleLogin onSuccess={handleGoogleSignUp} onError={(error) => {
              console.log("Google Login Failed")
              setErrorMsg("Google Error",error)}} /> 
           

        </form>

        <div className="text-sm flex gap-3 mt-3 font-semibold">
          <p>Already have an account?</p>
          <Link to='/sign-in' className='text-blue-600'>Sign In</Link>
        </div>
        {errorMsg && (<Alert className='mt-5' color='failure'>{errorMsg}</Alert>)}
      </div>
      
    </div>
  )
}

export default SignUp
