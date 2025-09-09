"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const SectionOne = () => {
  const bgRef = useRef(null);

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

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    gsap.ticker.add(() => {
      target.x += (mouse.x - target.x) * 0.05;
      target.y += (mouse.y - target.y) * 0.05;

      if (bgRef.current) {
        gsap.set(bgRef.current, {
          x: -target.x * 20, 
          y: -target.y * 20,
        });
      }
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="section-one"
      className="relative h-[120vh] w-full flex items-center justify-center overflow-hidden"
    >
      {/* oversized image wrapper */}
      <div
        ref={bgRef}
        className="absolute left-[-2vw] top-[-2vw] will-change-transform"
        style={{ width: "120%", height: "120%" }} 
      >
        <Image
          src="/assets/bgImg.webp"
          alt="bg-img"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* text content */}
      <div className="absolute inset-0 py-[7vw] px-[3vw] z-10">
        <p className="text-[3.5vw] one-text-one tracking-tighter font-medium w-[30%] leading-[1]">
          We fund <span className="font-display">sci-fi</span> companies.
        </p>
      </div>

      <div className="absolute bottom-[12vw] right-10 z-10">
        <p className="text-[3.5vw] tracking-tighter one-text-one font-medium flex flex-col w-full leading-[1]">
          Baking pioneers{" "}
          <span>
            in <span className="font-display">future</span> tech.
          </span>
        </p>
      </div>
    </section>
  );
};

export default SectionOne;
