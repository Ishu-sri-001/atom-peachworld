import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Btn = ({title, href}) => {

  

  
  return (
    <div>
       <Link href={href}>
            <div className={` text-[1.2vw] curdor-pointer para overflow-hidden mobile:text-[4.2vw] group rounded-full flex pb-0 text-white font-medium   px-[0.9vw] py-[0.4vw] mobile:px-[2vw]`}>
              <span className='h-[2vw]'>
               {title}
              </span>
               <div className=''>
      <button className={`rounded-full h-[2vw] w-[2vw] mobile:mt-[1vw] mobile:h-[5vw] mobile:w-[5vw] ml-2 bg-white  cursor-pointer transition-all btn duration-300 ease-in-out transform hover:scale-105 overflow-hidden`}>
        <div className='relative h-[2vw] w-[2vw] mobile:h-[5vw] mobile:w-[5vw]  overflow-hidden'>
  {/* Top arrow - visible by default, moves up on hover */}
  <div className='absolute inset-0 mobile:top-[-10%] transition-transform duration-300 ease-in-out  group-hover:-translate-y-[1.5vw] group-hover:-translate-x-[-2vw] h-[2vw] w-[2vw] mobile:h-[6vw] mobile:w-[6vw]'>
    <Image
      src='/assets/svg/arrow.svg' 
      width={400} 
      height={400} 
      alt='Arrow up' 
      className='w-full h-full object-cover'
    />
  </div>

  
  <div className='absolute inset-0 translate-y-[2vw] transition-transform duration-300 ease-in-out translate-x-[-2.7vw] group-hover:translate-y-0 group-hover:-translate-x-0 h-[2vw] w-[2vw] mobile:w-[6vw] mobile:h-[6vw]'>
    <Image
      src='/assets/svg/arrow.svg' 
      width={400} 
      height={400} 
      alt='Arrow down' 
      className='w-full h-full'
    />
  </div>
</div>

      </button>
    </div>  
              </div>
            </Link>

    </div>
  )
}

export default Btn