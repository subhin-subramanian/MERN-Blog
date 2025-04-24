import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import AllComments from "./AllComments";

function CommentSection({postId}) {
  const {currentUser} = useSelector(state=>state.user);
  const [comment,setComment] = useState(null);
  const [commentError,setCommentError] = useState(null);
  const [allComments,setAllComments] = useState([]);
  const [allCommentsError,setAllCommentsError] = useState(null);
  
//Function to submit comment to database via backend
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(comment.length > 200){
        setCommentError('Comment must not have more than 200 letters');
    }
    if(!comment){
        setCommentError('Write some comment before submitting');
    }
    try {
        const res = await fetch(`/api/comment/create`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({content:comment,postId,userId:currentUser._id})
        });
        const data = await res.json();
        if(!res.ok){
            setCommentError(data.message);
            return;
        }
        setCommentError(null);
        setComment('');
        setAllComments([data,...allComments]);
    } catch (error) {
        setCommentError(error.message);
    }
  }

//Useeffect with fetchComments function to render all comments
useEffect(()=>{
    setAllCommentsError(null);
    const fetchComments = async()=>{
      try {
        const res = await fetch(`/api/comment/getcomments/${postId}`);
        const data = await res.json();
        if(!res.ok){
            setAllCommentsError(data.message);
            return;
        }
        setAllCommentsError(null);
        setAllComments(data)
      } catch (error) {
            setAllCommentsError(error.message);
      }
    }
    fetchComments();
},[postId]);
  
//Function to handle like
  const handleLike = async(likedComment)=>{
    setAllComments(allComments.map((mapcomment)=>
      mapcomment._id === likedComment._id ? {
      ...mapcomment,
      likes:likedComment.likes,
      numberOfLikes:likedComment.numberOfLikes
    }:mapcomment));
    setCommentError('');
  }
 
//Function to handle edit
  const handleEdit = (editedComment)=>{
    setAllComments(allComments.map((mapcomment)=>
      mapcomment._id === editedComment._id ? {...mapcomment,content:editedComment.content} : mapcomment));
    setCommentError('');
  }
  
  //Function to handle delete
  const handleDelete = (deletedComment)=>{
    setAllComments(allComments.filter(filtercomm=>filtercomm._id !== deletedComment));
  }

  return (
    <div className="max-w-4xl w-full mx-auto my-8">
      {currentUser ? (
       <>
        <div className="flex items-center gap-3 text-sm font-semibold">
            <p>You're signed in as:</p>
            <img src={currentUser.profilePic} alt="user" className="h-10 rounded-full" />
            <Link to={'/dashboard?tab=profile'}>@{currentUser.username}</Link>
        </div>
        <form className="border-2 border-blue-400 rounded-lg p-3 mt-2" onSubmit={handleSubmit}>
            <Textarea placeholder="Add a comment"  rows='3' maxLength='200' onChange={(e)=>setComment(e.target.value)}/>
            <p className="text-sm mb-3">Characters remaining</p>
            <Button type="submit" color='default'>Submit</Button>
        </form>
        {commentError && <Alert className='mt-10' color='failure'>{commentError}</Alert>}
       </>):(
        <div>
            You must signed in to comment,<Link to={'/sign-in'}>sign-in</Link>
        </div>
       )}

       {allComments.length === 0 ?(
        <p className='text-sm my-5'>No comments yet for this post</p>
       ):(
        <div>
            <div className="flex gap-2 py-3">
              <h2>Comments</h2>
              <p className='border border-blue-400 rounded-full px-2'>{allComments.length}</p>
            </div>
            {allComments.map((comment)=>(
                <AllComments key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete}/>
            ))}
            {allCommentsError && <Alert className='mt-10' color='failure'>{allCommentsError}</Alert>}
        </div>
       )}
    </div>
  )
}
export default CommentSection
