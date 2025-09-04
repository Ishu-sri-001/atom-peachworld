"use client";
import Image from "next/image";
import React, {useEffect} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

const SectionOne = () => {

  useEffect(() => {
    gsap.fromTo('.one-text-one', {
      opacity:1,
    }, {
      opacity:0,
      duration:0.2,
      scrollTrigger: {
        trigger: '#section-one',
        start: '10% 10%',
        end:'15% 10%',
        scrub:true,
        // markers: true,
      }
    })
  })

  return (
    <section
      id="section-one"
      className="relative h-[120vh] w-full  flex items-center justify-center "
    >
      <div className="h-full w-[150vw]">
        <Image
          src="/assets/bgImg.webp"
          width={1000}
          height={1000}
          alt="bg-img"
          className="object-fill h-full w-full"
        />
      </div>
      <div className="absolute inset-0 py-[7vw] px-[3vw]">

        <p className="text-[3.5vw] one-text-one tracking-tighter font-medium w-[30%] leading-[1]">We fund <span className="font-display">sci-fi</span> companies.</p>

      </div>
      <div className="absolute bottom-[12vw] right-10 py-[0vw] px-[0vw]">

        <p className="text-[3.5vw] tracking-tighter one-text-one font-medium flex flex-col  w-[100%] leading-[1]">Baking pioneers 
          <span>
           in <span className="font-display">future</span> tech. </span></p>

      </div>
    </section>
  );
};

export default SectionOne;
