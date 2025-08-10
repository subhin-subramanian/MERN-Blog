import { Button, FileInput, Select, Textarea, TextInput,Alert } from "flowbite-react"
import { useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function CreatePost() {

  const [formData,setFormData] = useState({});
  const [imageUploadError,setImageUploadError] = useState(null);
  const [publishError,setPublishError] = useState(null);
  const {currentUser} = useSelector(state=>state.user);
  const navigate = useNavigate();
  
  // Function to store formdata
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  // Function for uploading cover image
  const handleImageChange = async(e)=>{
    setImageUploadError(null);
    const file = e.target.files[0];
    if(!file) return;
    if(file.size > 2*1024*1024){
      setImageUploadError('Image size must be less than 2mb');
      return;
    }
    // Uploading image to backend
    const reader = new FileReader();
    
    reader.onloadend = async ()=>{
      const base64String = reader.result;
      try {
        const res = await fetch('/api/upload',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({image:base64String}),
        });
        const data = await res.json();
        if (!res.ok){
          setImageUploadError(data.message);
        return;
      }
      if(data.imageUrl){ 
        setFormData({...formData,image: data.imageUrl});
      }
      } catch (error) {
        setImageUploadError('Upload failed:'+error);
      }
    }

    if(file){
      reader.readAsDataURL(file); // Convert image to base64
    }
  }

  // Function for saving formdata to database
  const handleSubmit = async(e)=>{
    e.preventDefault();
    setPublishError(null);
    console.log(formData);
    
    try {
      const res = await fetch(`/api/post/create`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
        return;
      }
      navigate(`/post/${data.slug}`)
    } catch (error) {
      setPublishError(error.message);
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">

      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-2" onChange={handleChange}/>
          <Select id="category" className="flex-1" onChange={handleChange}>
            <option value="Uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option> 
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-blue-500 border-dotted p-3">
          <FileInput type='file' accept="image/*" onChange={handleImageChange}/>
          <Button type="button" outline >Upload Image</Button>
        </div>

        {imageUploadError && <Alert color='failure' >{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} alt='upload' className='w-full h-72 object-cover'/>}

        <ReactQuill theme="snow" value={formData.content || ' '} className="h-72 mb-10" onChange={(e)=>setFormData({...formData,content:e})} />
    
        <Button type="submit" className="bg-gradient-to-r from-blue-700 to-green-400">Publish</Button>

      </form>
      {publishError && <Alert color='failure' >{publishError}</Alert>}
    </div>
  )
}
export default CreatePost
