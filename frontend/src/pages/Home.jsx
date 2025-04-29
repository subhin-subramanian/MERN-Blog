import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react"
import PostCard from "../components/PostCard";

function Home() {
  const [posts,setPosts] = useState([]);
  const [postsError,setPostsError] = useState(null);
  const [showMore,setShowMore] = useState(false);
  const [category,setCategory] = useState(null);
  console.log(category);
  

  useEffect(()=>{
    const fetchPosts = async()=>{
      setPostsError(null);
      try {
        const res = await (category ? fetch(`/api/post/getposts?limit=8&category=${category}`) : fetch(`/api/post/getposts?limit=8`));
        const data = await res.json();
        if(!res.ok){
          setPostsError(data.message);
          return;
        }
        if(data.posts.length === 8){   
          setShowMore(true);
        }else setShowMore(false);
        setPosts(data.posts);
      } catch (error) {
        setPostsError(error.message);        
      }

    }
    fetchPosts();
  },[category]);

  // Function to fetch more posts onclicking show more 
  const handleShowMore = async()=>{
    try {
      const res = await fetch(`/api/post/getposts?startIndex=8&limit=8`);
      const data = await res.json();
      if(!res.ok){
        setPostsError(data.message);
        return;
      }
      if(data.posts.length === 8){   
        setShowMore(true);
      }else{
        setShowMore(false);
      }
      setPosts(prev=>([...prev,...data.posts]));
      setPostsError(null);
    } catch (error) {
      setPostsError(error.message);        
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-100 to-white dark:from-blue-800 dark:to-blue-900'>

      <div className="text-center flex flex-col gap-5">
        <h1 className="text-5xl font-bold  py-8 sm:py-14">Welcome to our blog...</h1>
        <p className="max-w-2xl w-full mx-auto">This blog is all about sharing what we're learning in the world of JavaScript, React, and Next.js. Whether you're just getting started or already deep in the dev game, you'll find tips, tutorials, and random dev thoughts — all in plain English, no gatekeeping.
        </p>
        <p className="font-semibold">
        <i> Think of this as a chill space to explore cool things, solve tricky bugs, and build better stuff on the web — together.</i>
        </p>
      </div>

      <form className="flex justify-center mx-auto mt-10 sm:mt-20">
        <TextInput className="max-w-80 w-full" placeholder="Example@gmail.com"/>
        <Button className="bg-gradient-to-r from-blue-500 to-green-500" onClick={()=>window.location.href="mailto:subscribe@gmail.com?subject=subscribe"}>Subscribe</Button>
      </form>
      <p className="text-center text-sm mb-10">Subscribe to get notifications, when a blog publishes.</p>

      <div className="flex gap-5 justify-center py-10 font-bold">
        <Button className="h-7 rounded-full bg-blue-900" onClick={()=>setCategory(null)}>All</Button>
        <Button className="h-7 rounded-full bg-blue-900" onClick={()=>setCategory('javascript')}>JavaScript</Button>
        <Button className="h-7 rounded-full bg-blue-900" onClick={()=>setCategory('reactjs')}>ReactJs</Button>
        <Button className="h-7 rounded-full bg-blue-900" onClick={()=>setCategory('nextjs')}>NextJs</Button>
        <Button className="h-7 rounded-full bg-blue-900" onClick={()=>setCategory('uncategorized')}>Uncategorized</Button>
      </div>
      {posts.length===0 ? <h1 className="flex justify-center p-10 font-semibold text-3xl text-green-400">No Posts...</h1>:
        <div className="grid grid-cols-1 ml-20 sm:ml-10 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {posts.map(post=>(<PostCard key={post._id} post={post}/>))}
        </div>}
      {showMore && <button onClick={handleShowMore} className="hover:underline flex mx-auto py-3 font-semibold cursor-pointer">Show More</button>}
     {postsError && <Alert color="failure">{postsError}</Alert>}

    </div>
  )
}

export default Home
