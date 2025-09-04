"use client";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  Environment,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { useControls } from 'leva';
import React, { Suspense, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { degToRad } from "three/src/math/MathUtils";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function SphereModel({ modelPath, texturePath, sphereRef }) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);

  const sphereMesh = nodes.BlackBall_mesh;

  return (
    <mesh
      ref={sphereRef}
      geometry={sphereMesh.geometry}
      scale={1.9}
      position={[1, 0, 0]}
    >
      <meshStandardMaterial map={texture} metalness={1.0} roughness={0.7} />
    </mesh>
  );
}

function TransparentRingModel({
  modelPath,
  scale = [1.2, 0.7, 1.2],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ringRef,
}) {
  const { nodes } = useGLTF(modelPath);
  const ringMesh = nodes.Cylinder;

  const materialProps = {
  thickness: 0.25,            // gives depth to the glass
  roughness: 0.05,            // smooth, almost glass-like
  transmission: 1.0,          // full transparency
  ior: 0.6,                   // realistic glass refraction
  chromaticAberration: 1.0,  // subtle rainbow dispersion
  backside: true,             // render both sides
  anisotropy: 1.5,            // helps with light streaking
  distortion: 0.6,            // small distortions for realism
  distortionScale: 0.2,
  temporalDistortion: 0.1,    // dynamic shimmering
};

  return (
    <mesh
      ref={ringRef}
      geometry={ringMesh.geometry}
      scale={scale}
      position={position}
      rotation={rotation}
      // material={MeshTransmissionMaterial}
    >
      {/* <meshStandardMaterial
        color="#ffffff"
        transparent={true}
        opacity={0.3}
        side={THREE.DoubleSide}
      /> */}
       <MeshTransmissionMaterial {...materialProps}/>
    </mesh>
  );
}

function MetallicRingModel({
  modelPath,
  scale = [1.2, 0.7, 1.2],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ringRef,
}) {
  const { nodes } = useGLTF(modelPath);
  const ringMesh = nodes.Cylinder;

  return (
    <mesh
      ref={ringRef}
      geometry={ringMesh.geometry}
      scale={scale}
      position={position}
      rotation={rotation}
    >
      {/* <meshStandardMaterial color="#black" metalness={1.0} roughness={0.1} /> */}
      <meshStandardMaterial
  color="#202020"        // deep base color
  metalness={1.0}        // full metal
  roughness={0.05}       // highly polished
  envMapIntensity={0.2}  // boosts environment reflections
  clearcoat={1.0}        // shiny clear coat
  clearcoatRoughness={0.05}
  sheen={0.8}            // subtle iridescent glow
  sheenTint={0}        // adjust tint (bluish/purple edges)
  iridescence={1.0}      // enables rainbow-like reflections
  iridescenceIOR={1.3}   // thin-film refraction index
  iridescenceThicknessRange={[100, 400]} // nm thickness for color shifts
/>
    </mesh>
  );
}



function CubeModel({ cubeRef }) {
  useEffect(() => {
   cubeRef.current.position.y= 5
   cubeRef.current.position.x=-5
   cubeRef.current.position.z=-1.5;
  }, [])
  
  return (
    <mesh ref={cubeRef}  scale={[1, 30, 2]} rotation={[0,degToRad(-5),degToRad(63.2)]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="black"
        metalness={0.2}
        roughness={0.9}
      />
    </mesh>
  );
}


// Preload
useGLTF.preload("/model/sphere.glb");
useGLTF.preload("/model/ring.glb");

const ModelCanvas = () => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const sphereRef = useRef();
  const cubeRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        if (!ring1Ref.current || !ring2Ref.current) {
          console.log("Refs not ready yet");
          return;
        }

        console.log("Creating scroll trigger animation");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-one",
            start: "top top",
            pin: true,
            end: "+=1800",
            scrub: true,
            // markers:true
          },
        });

        tl.to(ring1Ref.current.rotation, {
          z: -Math.PI * 1.75,
          ease: "none",
          duration: 1,
        }).to(
          ring2Ref.current.rotation,
          {
            y: Math.PI * 1.5,
            ease: "none",
            duration: 1,
          },
          "<"
        );

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-one",
            start: "top top",
            end: "+=350",
            scrub: true,
            // markers: true,
          },
        });

        tl2
          .to(ring1Ref.current.position, {
            y: 30,
            duration: 1,
            ease: "power1.inOut",
          })
          .to(
            ring2Ref.current.position,
            {
              y: 20,
              duration: 1,
              ease: "power1.inOut",
            },
            "<"
          )
          .to(
            sphereRef.current.rotation,
            {
              z: degToRad(360 * 2),
              duration: 1,
              ease: "none",
            },
            "<"
          );


        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-two",
            start: "top 67%",
            scrub: true,
            // pin:true,
            end: "bottom top",
            // markers: true,
          },
        });

        tl3.to(sphereRef.current.rotation, {
          z: `+=${degToRad(360 * 5)}`,
          duration: 1,
          ease: "none",
        })
        .to(sphereRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'none'
        }, '<')
        gsap.to(sphereRef.current.rotation, {
  z: `+=${degToRad(360 * 5)}`, 
  ease: "none",
  scrollTrigger: {
    trigger: "#section-mid",
    start: "40% 50%",
    end: "bottom top",
    scrub: true,
  },
});

        const tt = gsap.timeline({
            scrollTrigger: {
              trigger:'#section-mid',
              start: '40% 50%',
              end: 'bottom top',
              scrub:true,
              // markers: true,
              pin: true,
            }
          })

          tt
        //   .to(sphereRef.current.rotation, {
        //   z: `+=${degToRad(360 * 5)}`,
        //   duration: 2,
        //   ease: "none",
        // })

        .fromTo(
      cubeRef.current.position,
      { y: -32 },   
      { 
        delay:-1.5,
        y: -0.5, 
        ease: "none" 
      }, '<'
    )
    .to(sphereRef.current.position, {
      x: 30,
      y:-15,
      delay: 0.5,
      duration:2,
      ease:'none'
    }, '<' )

      const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-three",
        start: "top bottom",   
        end: "top top",        
        scrub: true,
        // pin: true,
        // markers: true,      
      },
    })
    tl4.to( cubeRef.current.position, {
      y: 25,
      delay:1.5,
      ease:'none'
    })
      });

      return () => ctx.revert();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-20">
    <Canvas
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
      camera={{ position: [0, 2, 20], fov: 60 }}
    >
      <Suspense fallback={null}>
        {/* <Environment background={false} preset="sunset" /> */}
         <Environment preset="studio" />

        
        {/* Sphere inside */}
        <SphereModel
          sphereRef={sphereRef}
          modelPath="/model/sphere.glb"
          texturePath="/assets/sphere-texture.webp"
        />

        {/* Ring 1 (horizontal) - Transparent */}
        <TransparentRingModel
          ringRef={ring1Ref}
          modelPath="/model/ring.glb"
          scale={[0.038, 0.02, 0.038]}
          position={[0, 0.3, -2]}
          rotation={[0, 0, 0]}
        />

        {/* Ring 2 (vertical, rotated 90°) - Metallic */}
        <MetallicRingModel
          ringRef={ring2Ref}
          modelPath="/model/ring.glb"
          scale={[0.03, 0.015, 0.03]}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, degToRad(50)]}
        />

        <CubeModel cubeRef={cubeRef} />

      </Suspense>

    

        {/* Small focused spot light above */}
{/* <directionalLight
  position={[0, 10, 5]}   // above + slightly forward
  intensity={2.5}         // brightness
  color="white"
/> */}


       {/* <pointLight
  position={[0, 10, 0]}
  intensity={20}          // strong highlight
  distance={30}           // limit light reach
  decay={2}
/> */}


      <OrbitControls enableZoom={false} />
    </Canvas>
    </div>
  );
};

export default ModelCanvas;
