import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "../types/user";
import { CommentInt } from "../types/comment";
import { Post } from "../types/post";
import { RootState } from "../redux/store";

function DashBoardComp() {
  
  const [users,setUsers] = useState <User[]>([]);
  const [totalUsers,setTotalUsers] = useState <number>(0);
  const [lastMonthUsers,setLastMonthUsers] = useState <number>(0);
  const [comments,setComments] = useState <CommentInt[]> ([]);
  const [totalComments,setTotalComments] = useState <number>(0);
  const [lastMonthComments,setLastMonthComments] = useState <number>(0);
  const [posts,setPosts] = useState <Post[]> ([]);
  const [totalPosts,setTotalPosts] = useState <number>(0);
  const [lastMonthPosts,setLastMonthPosts] = useState <number>(0);
  const {currentUser} = useSelector((state : RootState) =>state.user);
  const [error,setError] = useState <string | null> (null);
  
  // Useeffect with functions inside for fetching user,post and comment details to render 
  useEffect(()=>{
    setError(null);
    const fetchUsers = async()=>{
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        if(!res.ok){
          setError(data.message);
          return;
        }
        setUsers(data.datafromBknd.users);
        setTotalUsers(data.datafromBknd.totalUsers);
        setLastMonthUsers(data.datafromBknd.lastMonthUsers);
        } catch (error:any) {
          setError(error.message);
        }
    }

    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/post/getposts?limit=5`);
        const data = await res.json();
        if(!res.ok){
          setError(data.message);
          return;
        }
        setPosts(data.datafromBknd.posts);
        setTotalPosts(data.datafromBknd.totalPosts);
        setLastMonthPosts(data.datafromBknd.lastMonthPosts); 
      } catch (error:any) {
        setError(error.message);
      }
    }

    const fetchComments = async()=>{
      try {
        const res = await fetch(`/api/comment/getallcomments?limit=5`);
        const data = await res.json();
        if(!res.ok){
          setError(data.message);
          return;
        }
        setComments(data.datafromBknd.comments);
        setTotalComments(data.datafromBknd.totalComments);
        setLastMonthComments(data.datafromBknd.lastMonthComments);
        setError(null);
      } catch (error:any) {
        setError(error.message);
      }     
    }

    if(currentUser && currentUser.isAdmin){
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  },[currentUser]);

  return (
    <div>
      {/* Container for Boxes */}
      <div className="mx-auto flex flex-wrap justify-center ">
        {/* Box for users */}
        <div className="w-80 p-10 m-5 flex flex-col gap-8 shadow-lg rounded-lg dark:bg-blue-900">
          <div className="flex gap-10">
            <div className="flex flex-col text-xl font-semibold">
              <span>Total Users</span>
              <span>{totalUsers}</span>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white size-9 p-1 rounded-full shadow-lg"/>
          </div>
          <div className="flex gap-3 md:text-base">
            <span className="text-green-500 flex gap-2 items-center"><HiArrowUp/>{lastMonthUsers}</span>
            <span className="text-gray-400">Last Month Users</span>
          </div>
        </div>
        {/* Box for posts */}
        <div className="w-80 p-10 m-5 flex flex-col gap-8 shadow-lg rounded-lg dark:bg-blue-900">
          <div className="flex gap-10">
            <div className="flex flex-col text-xl font-semibold">
              <span>Total Posts</span>
              <span>{totalPosts}</span>
            </div>
            <HiDocumentText className="bg-indigo-600 text-white size-9 p-1 rounded-full shadow-lg"/>
          </div>
          <div className="flex gap-3 md:text-base">
            <span className="text-green-500 flex gap-2 items-center"><HiArrowUp/>{lastMonthPosts}</span>
            <span className="text-gray-400">Last Month Posts</span>
          </div>
        </div>
        {/* Box for comments */}
        <div className="w-80 p-10 m-5 flex flex-col gap-8 shadow-lg rounded-lg dark:bg-blue-900">
          <div className="flex gap-10">
            <div className="flex flex-col text-xl font-semibold">
              <span>Total Comments</span>
              <span>{totalComments}</span>
            </div>
            <HiAnnotation className="bg-lime-600 text-white size-9 p-1 rounded-full shadow-lg"/>
          </div>
          <div className="flex gap-3 md:text-base">
            <span className="text-green-500 flex gap-2 items-center"><HiArrowUp/>{lastMonthComments}</span>
            <span className="text-gray-400">Last Month Comments</span>
          </div>
        </div>
      </div>

      {/* Container for Tables  */}
      <div className="m-5 flex flex-wrap gap-4 mx-auto justify-center">
        {/* User table */}
        <div className="shadow-lg rounded-lg w-full md:w-auto">
          <div className="flex justify-between">
            <h2 className="font-semibold self-center p-2">Recent Users</h2>
            <Link to={'/dashboard?tab=users'}>
              <Button className='m-2'>See all</Button>
            </Link>     
          </div>
          <Table hoverable  className="text-center">
            <TableHead>
              <TableRow>
                <TableHeadCell>User Image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
              </TableRow>
            </TableHead>
            {users.map(user=>(
              <TableBody key={user._id} className="dark:bg-blue-900">
                <TableRow>
                  <TableCell><img src={user.profilePic} alt="img" className="h-10 rounded-full"/></TableCell>
                  <TableCell className="w-72">{user.username}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </div>
        {/* Comment table */}
        <div className="shadow-lg rounded-lg w-full md:w-auto">
          <div className="flex justify-between">
            <h2 className="font-semibold self-center p-2">Recent Comments</h2>
            <Link to={'/dashboard?tab=comments'}>
              <Button className='m-2'>See all</Button>
            </Link>     
          </div>
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Comment</TableHeadCell>
                <TableHeadCell>Likes</TableHeadCell>
              </TableRow>
            </TableHead>
            {comments.map(comment=>(
              <TableBody key={comment._id} className="dark:bg-blue-900">
                <TableRow>
                  <TableCell className="line-clamp-2 w-96">{comment.content}</TableCell>
                  <TableCell className="text-center">{comment.numberOfLikes}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </div>
        {/* Post table */}
        <div className="shadow-lg rounded-lg w-full md:w-auto">
          <div className="flex justify-between">
            <h2 className="font-semibold self-center p-2">Recent Posts</h2>
            <Link to={'/dashboard?tab=posts'}>
              <Button className='m-2'>See all</Button>
            </Link>     
          </div>
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Post Image</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
              </TableRow>
            </TableHead>
            {posts.map(post=>(
              <TableBody key={post._id} className="dark:bg-blue-900">
                <TableRow>
                  <TableCell><img src={post.image} alt="img" className="h-10"/></TableCell>
                  <TableCell className="w-72 line-clamp-1">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </div>

      </div>
      
    </div>
  )
}
export default DashBoardComp
