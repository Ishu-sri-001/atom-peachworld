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

  function AdditionalSphere({ position, scale, isTransparent, sphereRef, modelPath, texturePath }) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);
  const sphereMesh = nodes.BlackBall_mesh;

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
      ref={sphereRef}
      geometry={sphereMesh.geometry}
      scale={scale}
      position={position}
    >
      {isTransparent ? (
        <MeshTransmissionMaterial {...materialProps} />
      ) : (
        <meshStandardMaterial map={texture} metalness={1.0} roughness={0.7} />
      )}
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
    >
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

  const additionalSphere1Ref = useRef();
  const additionalSphere2Ref = useRef();
  const additionalSphere3Ref = useRef();
  const additionalSphere4Ref = useRef();
  const additionalSphere5Ref = useRef();

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
  z: `+=${degToRad(360 * 20)}`, 
  ease: "none",
 scrollTrigger: {
    trigger: "#section-two",
    start: "top top",         
    endTrigger: "#section-five", 
    end: "bottom top ",
    scrub: true,
    // markers: true
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
    
    .to(sphereRef.current.position, {
      x: 0, 
    y: -30, 
    delay:0.5,
    ease: "ease" 
    })

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

    
    const tl5 =gsap.timeline({
      scrollTrigger: {
        trigger: '#section-four',
        start: 'top top',
        end: 'bottom top',
        scrub:true,
        pin:true,
        // markers: true,
      }
    })

    const additionalSpheres = [
      additionalSphere1Ref,
      additionalSphere2Ref,
      additionalSphere3Ref,
      additionalSphere4Ref,
      additionalSphere5Ref
    ];
    
    additionalSpheres.forEach(sphereRef => {
      if (sphereRef.current) {
        sphereRef.current.material.transparent = true;
        sphereRef.current.material.opacity = 0;
        sphereRef.current.scale.setScalar(0.0);
      }
    })

    tl5.to(
  sphereRef.current.position,
        {
    x: 0, 
    y: 0, 
    // delay:0.5,
    ease: "ease" }  
)
    .to(sphereRef.current.scale, {
      x: 3.3,
      y:3.3,
      z:3.3,
      delay:0.5,
      duration:2,
    })

    .to([
      additionalSphere1Ref.current.material,
      additionalSphere2Ref.current.material,
      additionalSphere3Ref.current.material,
      additionalSphere4Ref.current.material,
      additionalSphere5Ref.current.material
    ], {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "<")
    .to([
      additionalSphere1Ref.current.scale,
      additionalSphere2Ref.current.scale,
      additionalSphere3Ref.current.scale,
      additionalSphere4Ref.current.scale,
      additionalSphere5Ref.current.scale
    ], {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      duration: 1.5,
      ease: "none",
      
    }, "<")

    .to([
      additionalSphere1Ref.current.position,
      additionalSphere2Ref.current.position,
      additionalSphere3Ref.current.position,
      additionalSphere4Ref.current.position,
      additionalSphere5Ref.current.position
    ] , {
      y: 20,
      delay:0.5,
    })
    .to (sphereRef.current.position, {
      y:20,
      // delay:0.5,
    }, '<')


    // gsap.to(sphereRef.current.position, {
    //   y:20,
    //   scrollTrigger: {
    //     trigger: '#section-four',
    //     start: 'top bottom',
    //     end: 'bottom top',
    //     // scrub:true,
    //     markers: true,
    //   }
    // })
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

         <AdditionalSphere
          sphereRef={additionalSphere1Ref}
          modelPath="/model/sphere.glb"
          texturePath="/assets/sphere-texture.webp"
          position={[-4.8, 3, 5.9]}
          scale={0.7}
          isTransparent={true}
        />
        <AdditionalSphere
          sphereRef={additionalSphere2Ref}
          modelPath="/model/sphere.glb"
          texturePath="/assets/sphere-texture.webp"
          position={[3.5, 1.5, 10]}
          scale={1.2}
          isTransparent={true}
        />
        
        {/* Textured spheres (3) */}
        <AdditionalSphere
          sphereRef={additionalSphere3Ref}
          modelPath="/model/sphere.glb"
          texturePath="/assets/sphere-texture.webp"
          position={[-9.2, -2, 2]}
          scale={0.6}
          isTransparent={false}
        />
        <AdditionalSphere
          sphereRef={additionalSphere4Ref}
          modelPath="/model/sphere.glb"
          texturePath="/assets/sphere-texture.webp"
          position={[11, -5, -3]}
          scale={0.5}
          isTransparent={false}
        />
        <AdditionalSphere
          sphereRef={additionalSphere5Ref}
          modelPath="/model/sphere.glb"
          texturePath="/assets/sphere-texture.webp"
          position={[-5.2, 7, -1]}
          scale={0.7}
          isTransparent={false}
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
          position={[0, 0, 1]}
          rotation={[Math.PI / 2, 0, degToRad(50)]}
        />

        <CubeModel cubeRef={cubeRef} />

      </Suspense>

  
      <OrbitControls enableZoom={false} />
    </Canvas>
    </div>
  );
};

export default ModelCanvas;
