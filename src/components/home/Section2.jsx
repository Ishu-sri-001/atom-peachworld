"use client";
import React, {useEffect} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const SectionTwo = () => {

  useEffect(() => {
    const ctx= gsap.context(() => {
        gsap.fromTo('.sec-2-text', {
            opacity:0,
        }, {
            opacity:1,
            stagger:0.5,
            duration:0.2,
            scrollTrigger: {
              trigger: '#section-two',
              start: '50% 40%',
              // end:'50% 20%',
              // markers:true,
              // scrub:true,         
            }
        })
    })
    return () => ctx.revert();
  })

  return (
    <section id='section-two' className="relative h-screen flex flex-col ">
      <div className="h-[20%]  mt-[-5vw] backdrop-blur-[0.4vw]"/>
      <div className="h-[20%]  mt-[-2vw] backdrop-blur-[0.9vw]"/>
      <div className="h-[70%] w-full flex justify-between px-[7vw] items-center bg-gradient-to-b from-[##E9E9E9] to-white">
        <p className="text-[4vw] opacity-0 font-display sec-2-text font-medium">Accelerate</p>
        <p className="text-[4vw] opacity-0 font-display sec-2-text font-medium">Growth</p>
              {/* <Image
                src="/assets/gradient.png"
                width={1000}
                height={1000}
                alt="bg-img"
                className="object-fill h-full w-full"
              /> */}
            </div>
           {/* <div className="h-[40%] w-full "> */}
{/* </div> */}

            
    </section>
  );
};

export default SectionTwo;
