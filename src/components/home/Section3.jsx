"use client";
import React, {useEffect} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import Btn from "../button";
gsap.registerPlugin(ScrollTrigger);

const SectionThree = () => {

  const data = [
  {
    src: "/assets/portfolio/img1.jpg",
    title: "Hyper Train",
    description: "Levitating public transportation.",
    href: "/hyper-train",
  },
  {
    src: "/assets/portfolio/img1.jpg",
    title: "eYugo",
    description: "The legend rides again.",
    href: "/eyugo",
  },
  {
    src: "/assets/portfolio/img1.jpg",
    title: "Neo Drive",
    description: "Future of electric mobility.",
    href: "/neo-drive",
  },
  {
    src: "/assets/portfolio/img1.jpg",
    title: "Sky Drone",
    description: "Autonomous delivery system.",
    href: "/sky-drone",
  },
  {
    src: "/assets/portfolio/img1.jpg",
    title: "Aero One",
    description: "Next-gen air travel.",
    href: "/aero-one",
  },
  {
    src: "/assets/portfolio/img1.jpg",
    title: "Volt Bike",
    description: "Reinventing two wheels.",
    href: "/volt-bike",
  },
];


  return (
    <section id='section-three' className="relative 
 gap-0 h-[200vh] flex items-center w-screen justify-center bg-white z-50 mt-[-0.4vw]">

      <div className="cube-container px-[3vw] w-full h-full bg-black [clip-path:polygon(89.5%_0,100%_5.5%,100%_100%,0_100%,0_0)]">
        <div className="flex flex-col mb-[2vw] gap-[1.5vw]">

          <p className="text-[3.5vw] text-white font-medium">Our Portfolio</p>
          <div className="flex">


          <div>
            <Btn title='BROWSE ALL' href='/' />
          </div>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-[5vw] py-[4vw]">
      {data.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="relative w-full h-[45vh] overflow-hidden rounded-[0.8vw] group"
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-[1.5vw] bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <h2 className="text-white text-[1.8vw] font-semibold">
              {item.title}
            </h2>
            <p className="text-gray-300 text-[1vw]">{item.description}</p>
          </div>
        </a>
      ))}
    </div>

      </div>
     
    </section>
  );
};

export default SectionThree;
