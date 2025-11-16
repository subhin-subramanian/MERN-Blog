import { Button, Label, TextInput,Alert, Spinner } from 'flowbite-react'
import { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { RootState } from "../redux/store";

interface UserData{
  username?: string;
  password?: string;
}

function SignIn() {
  
  const [formData,setFormData] = useState <UserData> ({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading,error:errorMsg} = useSelector((state: RootState) =>state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  
  const handleSubmit = async(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!formData.username || !formData.password){
      return dispatch(signInFailure('All fields are required'));
    }
    try {
      dispatch(signInStart());
      const response = await fetch('/api/user/sign-in',{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await response.json(); 
      if(!response.ok){
        dispatch(signInFailure(data.message));       
        return;
      }
      dispatch(signInSuccess(data.datafromBknd));
      navigate('/')
    } catch (error:any) {
      dispatch(signInFailure(error.message));   
    }
  }

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse)=>{
    if(!formData.password){
      return dispatch(signInFailure('Password is required'));
    }
    try {
      dispatch(signInStart());
      const response = await fetch('/api/user/sign-in/google',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({token:credentialResponse.credential,password:formData.password})
      });
      const data = await response.json(); 
      if(!response.ok){
        dispatch(signInFailure(data.message));       
        return;
      }
      dispatch(signInSuccess(data.datafromBknd));
      navigate('/')
    } catch (error:any) {
      dispatch(signInFailure(error.message));   
    }
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
              <Label htmlFor='username'/>
              <TextInput type='text' 
              placeholder='username' id='username' onChange={handleChange}/>
            </div>      
  
            <div>
              <Label htmlFor='Password'/>
              <TextInput type='password' placeholder='password' id='password' onChange={handleChange}/>
            </div>
      
            <Button className=' border border-blue-600 rounded-lg px-2 bg-blue-600 text-white hover:bg-white hover:text-blue-600 transition duration-500' type='submit'disabled={loading}>
            {loading ?(
              <>
               <Spinner size='sm'/>
                <span>Loading...</span>
              </>
            ) :('Sign In')}</Button>
            
            <GoogleLogin onSuccess={handleGoogleSignIn} onError={() => {
              console.log("Google Login Failed")
              dispatch(signInFailure('Google Sign-in Failed'));}} /> 
                    
          </form>
  
          <div className="text-sm flex gap-3 mt-3 font-semibold">
            <p>Don't have an account?</p>
            <Link to='/sign-up' className='text-blue-600'>Sign Up</Link>
          </div>
          {errorMsg && (
          <Alert className="mt-5" color="failure">
            {typeof errorMsg === 'string'
              ? errorMsg
              : errorMsg.message || 'An error occurred'}
          </Alert>
        )}
        </div>

      </div>
    )
  }
export default SignIn
