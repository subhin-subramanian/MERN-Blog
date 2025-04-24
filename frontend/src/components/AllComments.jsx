import { Button, Textarea, Modal, ModalBody, ModalHeader, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import moment from 'moment';
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function AllComments({comment,onLike,onEdit,onDelete}) {
    const [error,setError] = useState(null);
    const [user,setUser] = useState({});
    const [isEditing,setIsEditing] = useState(false);
    const [editedComment,setEditedComment] = useState(comment.content);
    const [showModal,setShowModal] = useState(false);
    const {currentUser} = useSelector(state=>state.user);
    const navigate = useNavigate();
    
    // Taking the user details of the comment
    useEffect(()=>{
        setError(null);
        const fetchUser = async()=>{
            try {
                const res = await fetch(`/api/user/getuser/${comment.userId}`);
                const data = await res.json();
                if(!res.ok){
                    setError(data.message);
                }
                setError(null);
                setUser(data);
            } catch (error) {
                setError(error.message);
            }
        }
        fetchUser();
    },[comment]);

    // Function to handle like
    const handleLike = async()=>{
      if(!currentUser){
        navigate('/sign-in');
        return;
      }
      try {
        const res = await fetch(`/api/comment/likecomment/${comment._id}`,{method:"PUT"});
        const data = await res.json();
        if(!res.ok){
            setError(data.message);
            return;
        }
        setError(null);
        onLike(data);
      } catch (error) {
        setError(error.message);
      }
    }

   // Function to save edited comment
    const handleEditSave = async()=>{
        setIsEditing(false);
        try {
            const res = await fetch(`/api/comment/editcomment/${comment._id}`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({content:editedComment})
            });
            const data = await res.json();
            if(!res.ok){
                setError(data.message);
            }
            setError('');
            onEdit(data);       
        } catch (error) {
            setError(error.message); 
        }
    }
    
   // Function to save delete a comment
    const handleDelete = async()=>{
        setShowModal(false);
        try {
            const response = await fetch (`/api/comment/deletecomment/${comment._id}`,{method:"DELETE"});
            const data = await response.json();
            if(!response.ok){
              setError(data.message);
              return;
            }
            onDelete(comment._id);
          } catch (error) {
            setError(error.message) 
          }
    }

  return (
    <div className="flex gap-3 my-5 py-4 border-b w-full">
      <img src={user.profilePic} alt="user" className="h-10 rounded-full"/>
      <div className="flex-1">
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">@{user.username}</span>
            <span className="text-xs text-gray-400">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ?(
            <div className="max-w-6xl w-full my-5">
              <Textarea className="w-full" placeholder={comment.content} rows='3' maxLength='300' onChange={(e)=>setEditedComment(e.target.value)} value={editedComment}/>
              <div className="flex justify-end p-4 gap-4">
                <Button onClick={handleEditSave} color='default'>Save</Button>
                <Button onClick={(e)=>setIsEditing(false)} className="bg-red-500 text-white">Cancel</Button>
              </div>
            </div>
        ):(
            <div>
              <p className="text-sm py-2">{comment.content}</p>
              <div className="border-b border-blue-300 dark:border-gray-400"></div>
              <div className="flex gap-3 text-xs mt-2">
                <button className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes  (currentUser._id) && 'text-blue-500'}`} type="button" onClick={handleLike}><FaThumbsUp/></button>
                <span>{(comment.numberOfLikes == 1 || comment.numberOfLikes ==0) ? comment.numberOfLikes+' '+'Like' :comment.numberOfLikes+' '+'Likes' }</span>
                {(currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <div className=" flex gap-3">
                    <button className="cursor-pointer" type="button" onClick={(e)=>setIsEditing(true)}>Edit</button>
                    <button className="cursor-pointer" type="button" onClick={()=>setShowModal(true)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
        )}
      </div>

      {error && <Alert color="failure" className="mt-4">{error}</Alert>}

      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size="md">
        <ModalHeader/>
        <ModalBody>
            <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto"/>
                <h3 className="mb-5 text-lg text-blue-800">Are you sure you want to delete this comment?</h3>
                <div className="flex justify-center gap-5">
                    <Button color='alternative' onClick={handleDelete}>Yes I'm sure</Button>
                    <Button color='default' onClick={()=>setShowModal(false)}>No I'm not</Button>
                </div>
            </div>
        </ModalBody>
       </Modal>
    
    </div>
  )
}

export default AllComments
