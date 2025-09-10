"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MidSection = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".clipped-div",
        { y: "100%" }, 
        {
          y: "0%",     
          ease: "none",
          scrollTrigger: {
            trigger: "#section-mid",
            start: "top bottom",   
            end: "20% top",       
            scrub: true,
            markers: false,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="section-mid" className="z-20">
      <div className="relative origin-top clipped-div h-[100vh] [clip-path:polygon(0_0,100%_110%,100%_100%,0_100%)] flex flex-col items-center justify-between">
        <div className="h-full w-full bg-black"></div>
      </div>
    </section>
  );
};

export default MidSection;
