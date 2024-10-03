import { Button, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import {Link,useLocation} from 'react-router-dom'
import { VscSearch } from "react-icons/vsc";
import {FaMoon} from 'react-icons/fa'


function Header() {
  const path=useLocation().pathname;
  return (
    <Navbar>
      <Link to='/' className='self-center whitespace-nowrap text-sm 
      sm:text-xl font-semibold dark:text-white'>
      <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
      rounded-lg text-white'>Subhin's</span>Blog
      </Link>

      <form>
        <TextInput 
          type='text'
          placeholder='Search'
          rightIcon={VscSearch}
          className='hidden lg:inline'/>
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <VscSearch/>
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
        <FaMoon/>
        </Button>
        <Link to='/sign-in'>
         <Button gradientDuoTone='purpleToBlue'>Sign In</Button>
        </Link>
        <NavbarToggle/>
      </div>
      <NavbarCollapse>
        <NavbarLink active={path === '/'} as={'div'}>
         <Link to='/'>Home</Link>
        </NavbarLink>
        <NavbarLink active={path === '/about'} as={'div'}> 
         <Link to='/about'>About</Link>
        </NavbarLink>
        <NavbarLink active={path === '/projects'} as={'div'}>
         <Link to='/projects'>Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
        
    </Navbar>
  )
}

export default Header
