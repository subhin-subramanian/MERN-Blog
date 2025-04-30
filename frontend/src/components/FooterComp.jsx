import { Footer, FooterCopyright, FooterDivider, FooterIcon, FooterLink, FooterLinkGroup, FooterTitle } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FaFacebook,FaInstagram,FaTwitter,FaGithub,FaDribbble } from "react-icons/fa";

function FooterComp() {
  return (
    <Footer container className='border border-t-8 border-blue-800 md:grid grid-cols-1 bg-gray-100'>

      <Link to='/' className=" self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
         <span className="px-3 py-2 bg-gradient-to-r from-blue-700 to-gray-100 rounded-4xl  text-white ">Subhin's Blog</span>
      </Link>

        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 sm:gap-6">

          <div className="ml-2">
            <FooterTitle title='About'/>
             <FooterLinkGroup col>
              <FooterLink href='#' target='_blank' rel='noopener noreferrer'>100JS Projects</FooterLink>
              <FooterLink href='#' target='_blank' rel='noopener noreferrer'>Subhin's Blog</FooterLink>
             </FooterLinkGroup>
          </div>

          <div className="">
            <FooterTitle title='Follow Us'/>
             <FooterLinkGroup col>
              <FooterLink href='#' target='_blank' rel='noopener noreferrer'>GitHub</FooterLink>
              <FooterLink href='#' target='_blank' rel='noopener noreferrer'>Discord</FooterLink>
             </FooterLinkGroup>
          </div>

          <div className="">
            <FooterTitle title='Legal'/>
             <FooterLinkGroup col>
              <FooterLink href='#'>Privacy Policy</FooterLink>
              <FooterLink href='#'>Terms & Conditions</FooterLink>
             </FooterLinkGroup>
          </div>
          
        </div>

        <div className=" flex flex-col gap-3 ">
          <FooterDivider/>

          <div className="flex gap-5 justify-between">
           <FooterCopyright href='#' by="Subhin's Blog" year={new Date().getFullYear()}/>
        
          <div className=" flex gap-3 sm:gap-6">
            <FooterIcon href='#' icon={FaFacebook}/>
            <FooterIcon href='#' icon={FaInstagram}/>
            <FooterIcon href='#' icon={FaTwitter}/>
            <FooterIcon href='#' icon={FaGithub}/>
            <FooterIcon href='#' icon={FaDribbble}/>
          </div>

          </div>  

        </div>
    </Footer>
  )
}

export default FooterComp


