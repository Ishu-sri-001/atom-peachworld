"use client";
import React from "react";
import Image from "next/image";

const SectionTwo = () => {
  return (
    <section id='section-two' className="relative h-screen flex flex-col items-center justify-between bg-white">
      <div className="h-[60%] w-full">
              <Image
                src="/assets/gradient.png"
                width={1000}
                height={1000}
                alt="bg-img"
                className="object-fill h-full w-full"
              />
            </div>
           <div className="h-[40%] w-full ">
</div>

            
    </section>
  );
};

export default SectionTwo;
