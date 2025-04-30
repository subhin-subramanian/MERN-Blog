import { Alert, Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadContext, TableRow } from "flowbite-react";
import { useEffect, useState } from "react"
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


function DashPosts() {

  const [posts,setPosts] = useState([]);
  const {currentUser} = useSelector(state=>state.user);
  const [postsError,setPostsError] = useState(null);
  const [showMore,setShowMore] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [postIdDelete,setPostIdDelete] = useState(null);

  // Fetchposts function with useEffect for getting the posts while opening the page
  useEffect(()=>{
    const fetchPosts = async ()=>{
      setPostsError(null);
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(!res.ok){
          setPostsError(data.message);
          return;
        }
        if(data.totalPosts > 9){   
          setShowMore(true);
        }
        setPosts(data.posts);
      } catch (error) {
        setPostsError(error.message);        
      }
    };
    if (currentUser && currentUser.isAdmin && currentUser._id) {    
      fetchPosts();
    }
  },[currentUser]);

  // Showmore function to display posts if total posts is more than 9
  const handleShowMore = async()=>{
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=9`);
      const data = await res.json();
      if(!res.ok){
        setPostsError(data.message);
        return;
      }
      if(data.posts.length >= 9){
        setShowMore(true);
      }
      setPosts(prev=>([...prev,...data.posts]));
      setPostsError(null);
    } catch (error) {
      setPostsError(error.message);        
    }
  }

  // Function to delete a post
  const handleDelete = async()=>{
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete/${postIdDelete}/${currentUser._id}`,{method:'DELETE'});
      const data = await res.json();
      if(!res.ok){
        setPostsError(data.message);
        return;
      }
      setPosts(prev=>prev.filter((post)=>post._id!==postIdDelete));
      setPostsError(null);
    } catch (error) {
      setPostsError(error.message);        
    }
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3">
      {currentUser.isAdmin && posts.length >0 ?(
        <>
         <Table hoverable className="shadow-md min-w-[800px]">
          <TableHead>
            <TableRow>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post Picture</TableHeadCell>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>Edit</TableHeadCell>
            </TableRow>
          </TableHead>
           
            <TableBody  className=" dark:bg-blue-900">
            {posts.map(post=>(
              <TableRow key={post._id} className="shadow-sm">
                <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt="post-img" className="w-20 h-10 object-cover" />
                  </Link>
                </TableCell>
                <TableCell>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell><span className="text-red-500 font-semibold hover:underline cursor-pointer" onClick={()=>{setShowModal(true),setPostIdDelete(post._id)}}>Delete</span></TableCell>
                <TableCell>
                  <Link to={`/update-post/${post._id}`}>
                    <span className="text-blue-500 font-semibold hover:underline cursor-pointer flex my-2">
                      Edit
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
          ))}
            </TableBody>
         </Table>
         {showMore && <button onClick={handleShowMore} className="font-semibold hover:underline hover:text-blue-600 w-full text-center my-5">show more</button>}
        </>
      ):<p>You have no posts yet!</p>}
      {postsError && <Alert color="failure">{postsError}</Alert>}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size="md">
        <ModalHeader/>
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto"/>
              <h3 className="mb-5 text-lg text-blue-800">Are you sure you want to delete this post?</h3>
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
export default DashPosts
