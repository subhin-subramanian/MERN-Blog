import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom'
import CommentSection from '../components/CommentSection';

function PostPage() {
  const {postSlug} = useParams();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [post,setPost] = useState({});

  
  // Fetchpost function with useEffect to get the post for rendering
  useEffect(()=>{
    const fetchpost = async()=>{
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if(!res.ok){
          setError(data.message);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
        setError(null);
      } catch (error) {
        setLoading(false);
        setError(data.message);
      }
    }
    fetchpost();
  },[postSlug])

  if (loading) return(
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size='xl'/>
    </div>
  );
  return(
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        <Button color='default' pill size='xs'>{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt='image' className='max-h-[300px] w-full object-cover mt-10 p-3' />
      <div className="flex justify-between p-2 border-b border-blue-300">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post.content && (post.content.length/1000).toFixed(0)} mins read</span>
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full" dangerouslySetInnerHTML={{__html:post && post.content}}></div>
      <CommentSection postId={post._id}/>
    </main>
  )
}
export default PostPage
