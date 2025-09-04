import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  const navLinks = [
    { label: "PORTFOLIO", href: "/portfolio" },
    { label: "TEAM", href: "/team" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <div className=' px-[3vw] z-50 w-full h-[15vh] fixed top-0 flex justify-between items-center'>

      <div className='pt-[1.5vw]'>
        <Image 
          src='/assets/atom-logo.svg' 
          height={200} 
          width={200} 
          className='h-[5vw] w-[5vw]' 
          alt='logo' 
        />
      </div>

      <div className='flex gap-[1.5vw]'>
        {navLinks.map((link, index) => (
          <Link key={index} href={link.href} className='link'>
            <p className='font-body font-semibold tracking-widest'>{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Header
