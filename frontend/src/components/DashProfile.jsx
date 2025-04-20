import { Alert, Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutSuccess, updateFailure, updateStart,  updateSuccess } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function DashProfile() {

    const {currentUser,error,loading} = useSelector(state=>state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl,setImageFileUrl] = useState(null);
    const [imageUploadError,setImageUploadError] = useState(null);
    const filePickRef = useRef();
    const [formData,setFormData] = useState({username:currentUser.username,email:currentUser.email,profilePic:currentUser.profilePic});
    const dispatch = useDispatch();
    const [updateStatus,setUpdateStatus] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const navigate = useNavigate();
    
    // Function for loading new profile picture
    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if (file.size > (2*1024*1024)){
            return setImageUploadError("Image size must be less than 2mb");
        }
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
            setFormData({...formData,profilePic:imageFileUrl});
        }
    }
    
    // Function to store formdata
    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    // Function to call the api for updating profile
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setUpdateStatus(false);
        if(formData.username === '' || formData.email==='' || formData.password===''){
            return console.log("All fields are required")
          }
        setFormData({...formData,profilePic: imageFileUrl || currentUser.profilePic});
        console.log(formData);
        
        try {
            dispatch(updateStart());
            const response = await fetch(`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok){
               dispatch(updateFailure(data.message));
            }else{
                dispatch(updateSuccess(data));
                setUpdateStatus(true);
            }
        } catch (error) {
            dispatch(updateFailure(error.message));         
        }
    }

    // Function to handle delete-account functionality

    const handleDeleteUser = async()=>{
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const response = await fetch(`/api/user/delete/${currentUser._id}`,{method:'DELETE'});
        const data = await response.json();
        if(!response.ok){
          dispatch(deleteUserFailure(data.message));
        }else{
          dispatch(deleteUserSuccess(data));
          navigate('/sign-up');
        }
      } catch (error) {
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
          dispatch(signOutSuccess(data));
          navigate('/sign-up');
        }
      } catch (error) {
        dispatch(signOutFailure(error.message));
      }
    }
    
  return (
    <div className="py-10 mx-auto">

      <h1 className='font-bold text-3xl text-center'>Profile</h1>

      <form className="flex flex-col items-center gap-5" onSubmit={handleSubmit}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickRef} hidden/>
        <div className="w-32 h-32 rounded-full mt-5 self-center cursor-pointer shadow-md" onClick={()=>filePickRef.current.click()} >
          <img src={imageFileUrl || currentUser.profilePic} alt="User" className="w-full h-full rounded-full border-3 " id="profilePic"/>
        </div>

        { imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}

        <TextInput className="w-80" type='text' defaultValue={currentUser.username} placeholder='username' id='username' onChange={handleChange}/>

        <TextInput className="w-80"  type='email' defaultValue={currentUser.email} placeholder='email' id='email' onChange={handleChange}/>

        <TextInput className="w-80"  type='password' placeholder='password' id='password' onChange={handleChange}/>

        <Button className="w-80 bg-gradient-to-r from-blue-700 to-green-400"  type='submit'>Update</Button>
      </form>

      <div className="text-red-600 flex justify-center gap-40 mt-2 text-sm font-semibold">
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account?</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>

      {updateStatus&& <Alert color="success" className="flex justify-self-center items-center w-96 mt-4">Profile Updated successfully</Alert>}

      {error && <Alert color="failure">{error}</Alert>}

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
