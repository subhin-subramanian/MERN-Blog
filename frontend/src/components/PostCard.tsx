import { Button } from 'flowbite-react'
import { HiArrowCircleRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  return (
    <div className="border border-blue-300 max-w-72 max-h-96 flex flex-col gap-3 rounded-md hover:translate-y-2 hover:border-2 transition-all duration-300">
        <img src={post.image} alt="image" className='rounded-t-md'/>
        <Button className="w-25 h-5 ml-3 bg-blue-300">{post.category}</Button>
        <h1 className="line-clamp-1 font-semibold ml-3">{post.title}</h1>
        <p className="line-clamp-2 text-xs ml-3" dangerouslySetInnerHTML={{__html:post && post.content}}></p>
        <Link to={`/post/${post.slug}`} className='mb-3'>
            <span className="font-bold ml-3 flex items-center gap-2 hover:translate-x-1">Read More <HiArrowCircleRight className="text-2xl" /> </span>
        </Link>
    </div>
  )
}
export default PostCard
