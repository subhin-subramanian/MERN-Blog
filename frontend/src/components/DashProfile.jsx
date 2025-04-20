import { Alert, Button, TextInput } from 'flowbite-react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFailure, updateStart,  updateSuccess } from '../redux/userSlice';

function DashProfile() {

    const {currentUser,error,loading} = useSelector(state=>state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl,setImageFileUrl] = useState(null);
    const [imageUploadError,setImageUploadError] = useState(null);
    const filePickRef = useRef();
    const [formData,setFormData] = useState({username:currentUser.username,email:currentUser.email,profilePic:currentUser.profilePic});
    const dispatch = useDispatch();
    const [updateStatus,setUpdateStatus] = useState(false);
    
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

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

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
        <span className='cursor-pointer'>Delete Account?</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>

      {updateStatus&& <Alert color="success" className="flex justify-self-center items-center w-96 mt-4">Profile Updated successfully</Alert>}

      {error && <Alert color="failure">{error}</Alert>}
      
    </div>
  )
}

export default DashProfile
