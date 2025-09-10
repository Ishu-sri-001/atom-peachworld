"use client";
import React from "react";
import Image from "next/image";

const SectionTwo = () => {
  return (
    <section id='section-two' className="relative h-screen flex flex-col ">
      <div className="h-[20%]  mt-[-5vw] backdrop-blur-[0.4vw]"/>
      <div className="h-[20%]  mt-[-2vw] backdrop-blur-[0.9vw]"/>
      <div className="h-[70%] w-full  bg-gradient-to-b from-[##E9E9E9] to-white">
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
