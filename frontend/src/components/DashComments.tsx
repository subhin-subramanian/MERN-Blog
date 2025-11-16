import { Button, Modal, ModalBody, ModalHeader, Alert, TableBody, TableRow, TableCell, Table, TableHead, TableHeadCell } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { RootState } from "../redux/store";
import { CommentInt } from "../types/comment";

function DashComments() {
  const {currentUser} = useSelector((state : RootState) =>state.user);
  const [comments,setComments] = useState <CommentInt[]> ([]);
  const [commentsError,setCommentsError] = useState <string | null> (null);
  const [showMore,setShowMore] = useState <boolean> (false);
  const [showModal,setShowModal] = useState <boolean> (false);
  const [commentIdDelete,setCommentIdDelete] = useState <string | null> (null);

  useEffect(()=>{
    const fetchAllComments = async()=>{
      try {
        const res = await fetch('/api/comment/getallcomments');
        const data = await res.json();
        if(!res.ok){
          setCommentsError(data.message);
        }
        setComments(data.datafromBknd.comments);
        setCommentsError(null);   
      } catch (error:any) {
        setCommentsError(error.message);   
      }
    }
    if(currentUser && currentUser.isAdmin){
      fetchAllComments();
    }
  },[currentUser?._id]);

  // Function to delete a comment
  const handleDelete = async()=>{
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deletecomment/${commentIdDelete}`,{method:'DELETE'});
      const data = await res.json();
      if(!res.ok){
        setCommentsError(data.message);
        return;
      }
      setComments(comments.filter(comment => comment._id !== commentIdDelete));
    } catch (error:any) {
      setCommentsError(error.message);
    }
  }
  
  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3">
      {currentUser?.isAdmin && comments.length >0 ?(
        <>
          <Table hoverable className="shadow-md min-w-[800px]">
            <TableHead>
              <TableRow>
                <TableHeadCell>Date Updated</TableHeadCell>
                <TableHeadCell>Comment</TableHeadCell>
                <TableHeadCell>No. of Likes</TableHeadCell>
                <TableHeadCell>PostId</TableHeadCell>
                <TableHeadCell>userId</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>
            {comments.map(comment=>(
            <TableBody key={comment._id} className="divide-y dark:bg-blue-900">
              <TableRow>
                <TableCell>{new Date(comment.updatedAt as string).toLocaleDateString()}</TableCell>
                <TableCell>{comment.content}</TableCell>
                <TableCell>{comment.numberOfLikes}</TableCell>
                <TableCell>{comment.postId}</TableCell>
                <TableCell>{comment.userId}</TableCell>
                <TableCell>
                  <span onClick={()=>{
                    setShowModal(true);
                    setCommentIdDelete(comment._id)}}
                    className="text-red-500 font-semibold hover:underline cursor-pointer">
                  Delete</span>
                </TableCell>
              </TableRow>
            </TableBody>
            ))}
          </Table> 
        </>):(  
          <p className='text-center mt-10'>No comments yet</p>
        )}
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
export default DashComments
