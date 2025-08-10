import { Alert, Button, FileInput, Select, Textarea, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function UpdatePost() {
  const [formData,setFormData] = useState({ title: '',
    category: 'Uncategorized',
    image: '',
    content: ''
  });
  const [imageUploadError,setImageUploadError] = useState(null);
  const [updateError,setUpdateError] = useState(null);
  const {currentUser} = useSelector(state=>state.user);
  const navigate = useNavigate();
  const {postId} = useParams();
  console.log(formData);
  

  // Function to get the existing post data and useEffect to default rendering
  useEffect(()=>{
    const fetchPost=async ()=>{
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok){
          setUpdateError(data.message);
          return;
        }
        setFormData(data.posts[0]);
        console.log(data.posts[0])
      } catch (error) {
        setUpdateError(error.message);
      }
    }
    fetchPost();
  },[postId])

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
    }
    
    // Uploading image to backend
    const reader = new FileReader();

    reader.onloadend = async()=>{
      const base64String = reader.result;
      try {
        const res = await fetch('/api/upload',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({image:base64String})
        });
        const data = await res.json();
        if(!res.ok){
          setImageUploadError(data.message);
          return;
        }
        if(data.imageUrl){ 
          setFormData({...formData,image: data.imageUrl});
        }
      } catch (error) {
        setImageUploadError('Image upload failed'+error);
      }
    }

    if(file){
      reader.readAsDataURL(file);
    } 
  }

  // Function for updating formdata to database
  const handleSubmit = async(e)=>{
    e.preventDefault();
    setUpdateError(null);
    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if(!res.ok){
        setUpdateError(data.message);
        return;
      }
      setFormData(data);
      navigate(`/post/${data.slug}`)
    } catch (error) {
      setUpdateError(error.message);
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">

      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1" value={formData.title} onChange={handleChange}/>
          <Select id="category" onChange={handleChange} value={formData.category} className="w-40">
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

        <Button type="submit" className="bg-gradient-to-r from-blue-700 to-green-400" >Update</Button>
      </form>

      {updateError && <Alert color='failure'>{updateError}</Alert>}

    </div>
  )
}
export default UpdatePost
