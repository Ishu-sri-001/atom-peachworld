"use client";
import React from "react";
import ModelCanvas from "@/components/model/ModelCanvas";
import SectionOne from "@/components/home/Section1";
import SectionTwo from "@/components/home/Section2";
import SectionThree from "@/components/home/Section3";
import MidSection from "@/components/home/MidSection";
import Header from "@/components/header";
import Section4 from "@/components/home/Section4";

const Page = () => {
  return (
    <div className="relative ">
      <Header />
      <ModelCanvas />
      <div className="relative z-10">
        <SectionOne />
        <SectionTwo />
        
         </div>
         <MidSection />
        <SectionThree />
        {/* <Section4 /> */}
     
    </div>
  );
};

export default Page;
