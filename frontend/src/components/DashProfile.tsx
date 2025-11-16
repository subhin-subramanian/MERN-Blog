import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react'
import { FormEvent, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutSuccess, updateFailure, updateStart,  updateSuccess } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { RootState } from '../redux/store';
import { User } from '../types/user';

function DashProfile() {

    const {currentUser,error,loading} = useSelector((state : RootState) =>state.user);
    const filePickRef = useRef <HTMLInputElement | null> (null);

    const [formData,setFormData] = useState <Partial<User>> ({
      username:currentUser?.username,
      email:currentUser?.email,
      profilePic:currentUser?.profilePic
    });

    const dispatch = useDispatch();
    const [imageUploadError,setImageUploadError] = useState <string | null> (null);
    const [updateStatus,setUpdateStatus] = useState <boolean> (false);
    const [showModal,setShowModal] = useState <boolean> (false);
    const navigate = useNavigate();
     
    // Function for uploading new profile picture
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>)=>{
        setImageUploadError(null);
        const file = e.target.files?.[0];
        if(!file) return;
        if (file.size > (2*1024*1024)){
            return setImageUploadError("Image size must be less than 2mb");
        }
        // Uploading image to backend
        const reader = new FileReader();

        reader.onloadend = async()=>{
          const base64String = reader.result;
          try {
          const res = await fetch('/api/upload',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({image:base64String})});
          const data = await res.json();
          if(data.imageUrl){ 
            setFormData({...formData,profilePic: data.datafromBknd.imageUrl});
          }
        } catch (error:any) {
          setImageUploadError(`Upload failed due to ${error}`);
        }
      }
      if(file){
        reader.readAsDataURL(file)
      }
    }
    
    // Function to store formdata
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    // Function to call the api for updating profile
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setUpdateStatus(false);
        if(formData.username === '' || formData.email==='' || formData.password===''){
            return console.log("All fields are required")
          }

        // updating and saving to database
        try {
            dispatch(updateStart());
            const response = await fetch(`/api/user/update/${currentUser?._id}`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok){
               dispatch(updateFailure(data.message));
            }else{
                dispatch(updateSuccess(data.datafromBknd));
                setUpdateStatus(true);
            }
        } catch (error:any) {
            dispatch(updateFailure(error.message));         
        }
    }

    // Function to handle delete-account functionality

    const handleDeleteUser = async()=>{
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const response = await fetch(`/api/user/delete/${currentUser?._id}`,{method:'DELETE'});
        const data = await response.json();
        if(!response.ok){
          dispatch(deleteUserFailure(data.message));
        }else{
          dispatch(deleteUserSuccess(data.message));
          navigate('/sign-up');
        }
      } catch (error:any) {
        dispatch(deleteUserFailure(error.message));
      }
    }

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
      }
    }
    
  return (
    <div className="py-10 mx-auto">

      <h1 className='font-bold text-3xl text-center'>Profile</h1>

      <form className="flex flex-col items-center gap-5" onSubmit={handleSubmit}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickRef} hidden/>
        <div className="w-32 h-32 rounded-full mt-5 self-center cursor-pointer shadow-md" onClick={()=>filePickRef.current?.click()} >
          <img src={formData.profilePic || currentUser?.profilePic} alt="User" className="w-full h-full rounded-full border-3 " id="profilePic"/>
        </div>

        { imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}

        <TextInput className="w-80" type='text' defaultValue={currentUser?.username} placeholder='username' id='username' onChange={handleChange}/>

        <TextInput className="w-80"  type='email' defaultValue={currentUser?.email} placeholder='email' id='email' onChange={handleChange}/>

        <TextInput className="w-80"  type='password' placeholder='password' id='password' onChange={handleChange}/>

        <Button className="w-80 hover:bg-gradient-to-r from-blue-700 to-green-400" outline  type='submit' disabled={loading}>{loading ? 'Loading...' : 'Update'}</Button>

        {currentUser?.isAdmin &&
        <Link to={'/create-post'}>
          <Button className="w-80 bg-gradient-to-r from-green-400 to-blue-700">Create a Post</Button>
        </Link>}
      </form>

      <div className="text-red-600 flex justify-center gap-40 mt-2 text-sm font-semibold">
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account?</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>

      {updateStatus&& <Alert color="success" className="flex justify-self-center items-center w-96 mt-4">Profile Updated successfully</Alert>}

      {error && <Alert color="failure">{typeof error === "string" ? error : error.message}</Alert>}

      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <ModalHeader className="bg-blue-300">
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto"/>
              <h3 className="mb-5 text-lg text-blue-800">Are you sure you want to delete the account?</h3>
              <div className="flex justify-center gap-5">
                <Button color='alternative' onClick={handleDeleteUser}>Yes I'm sure</Button>
                <Button color='default' onClick={()=>setShowModal(false)}>No I'm not</Button>
              </div>
            </div>
          </ModalBody>
        </ModalHeader>

      </Modal>

      
    </div>
  )
}

export default DashProfile
