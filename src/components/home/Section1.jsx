"use client";
import Image from "next/image";
import React from "react";

const SectionOne = () => {
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
    </section>
  );
};

export default SectionOne;
