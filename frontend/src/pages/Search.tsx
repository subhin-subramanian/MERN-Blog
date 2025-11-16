import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Post } from "../types/post";

interface SidebarData{
  searchTerm: string;
  sort: string;
  category: string;
}

function Search() {
    const [sidebarData,setSidebarData] = useState <SidebarData> ({searchTerm:'',sort:'desc',category:'uncategorized'});
    const [posts,setPosts] = useState <Post[]> ([]);
    const [loading,setLoading] = useState <boolean> (false);
    const [error,setError] = useState <string | null> (null);
    const location = useLocation();
    const navigate = useNavigate();
    const [showMore,setShowMore] = useState <boolean> (false);
    
    // Fetching posts as per searchQuery for page
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchUrl = urlParams.get("searchTerm") || "";
        const sortUrl = urlParams.get("sort") || "desc";
        const categoryUrl = urlParams.get("category") || "uncategorized"; 

        setSidebarData({
          searchTerm: searchUrl,
          sort: sortUrl,
          category: categoryUrl,
        });

        const fetchPosts = async()=>{
            setLoading(true);
            const searchQuery = urlParams.toString();         
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            const data = await res.json();
            if(!res.ok){
                setError(data.message);
                return;
            }
            setPosts(data.datafromBknd.posts);
            setError(null);
            setLoading(false); 
            if(data.datafromBknd.posts.length>8){
                setShowMore(true);                                 
            } 
        }
        fetchPosts();   
    },[location.search]);

    // Function to handle the show more button
    const handleShowMore = async ()=>{
      const urlParams = new URLSearchParams(location.search);   
      urlParams.set('startIndex',String(9));
      const searchQuery = urlParams.toString();
      try {
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await response.json();
        if(!response.ok){
            console.log(data.message);
            return;
        }
        setPosts((prev) => {
          const updated = [...prev, ...data.datafromBknd.posts];
          return updated;
        });
        if(data.datafromBknd.posts.length >= 9){
            setShowMore(true);
        }else{
            setShowMore(false);
        }
      } catch (error:any) {
        setError(error.message)
      }
    }
    
    // Function to reset sidebardata when we type in filters
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        if(e.target.id==='searchTerm'){
            setSidebarData({...sidebarData,searchTerm:e.target.value});
        }
        if(e.target.id==='sort'){
            setSidebarData({...sidebarData,sort:e.target.value});
        }
        if(e.target.id==='category'){
            setSidebarData({...sidebarData,category:e.target.value})
        }
    }
    
    // Function to reload page with the applied filters
    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('category',sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

  return (
    <div className='flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className="p-7 border-b border-blue-300 dark:border-blue-800 md:border-r-2 md:min-h-screen shadow-md">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput placeholder="search..." id="searchTerm" type="text" value={sidebarData.searchTerm} onChange={handleChange}/>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort || 'desc'} id="sort" className="w-20">
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold">Category:</label>
            <Select onChange={handleChange} value={sidebarData.category || 'uncategorized'} id='category' className="w-32">
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" className="bg-gradient-to-br from-blue-400 to-green-300">Apply Filters</Button>
        </form>
      </div>
      {/* Post cards */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b  border-blue-300 dark:border-blue-800 shadow-sm  p-3 mt-5">Post Results:</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-7"> 
            {!loading && posts.length===0 && (<p className="text-xl">No posts found!</p>)}
            {loading && <p className="text-xl">Loading...</p>}
            {!loading && posts && posts.map((post)=><PostCard key={post._id} post={post}/>)}
        </div>
        {showMore && <button onClick={handleShowMore} className="hover:underline flex mx-auto py-3 font-semibold cursor-pointer">Show More</button>}
      </div>
    </div>
  )
}

export default Search
