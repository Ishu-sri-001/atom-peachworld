"use client";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  Environment,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Loader } from "@react-three/drei";
import { useProgress } from "@react-three/drei";
import { useControls } from 'leva';
import React, { Suspense, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { degToRad } from "three/src/math/MathUtils";
// import { useControls } from 'leva'
import * as THREE from "three";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function useModelsReady(dependencies) {
  const { progress } = useProgress();
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    console.log(`Loading progress: ${progress.toFixed(2)}%`);

    if (progress === 100) {
      // Keep checking until all refs are filled
      const interval = setInterval(() => {
        if (dependencies.every(ref => ref.current)) {
          setReady(true);
          clearInterval(interval); // stop checking
        }
      }, 50); // check every 50ms

      return () => clearInterval(interval);
    }
  }, [progress, dependencies]);

  return ready;
}



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
  temporalDistortion: 0,    // dynamic shimmering
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


//  const {
//     thickness,
//     roughness,
//     transmission,
//     ior,
//     chromaticAberration,
//     anisotropy,
//     distortion,
//     distortionScale,
//     temporalDistortion,
//   } = useControls("Transparent Ring", {
//     thickness: { value: 0.25, min: 0, max: 2, step: 0.01 },
//     roughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
//     transmission: { value: 1.0, min: 0, max: 1, step: 0.01 },
//     ior: { value: 0.6, min: 0, max: 3, step: 0.01 },
//     chromaticAberration: { value: 0.2, min: 0, max: 1, step: 0.01 },
//     anisotropy: { value: 1.5, min: 0, max: 10, step: 0.1 },
//     distortion: { value: 0.6, min: 0, max: 1, step: 0.01 },
//     distortionScale: { value: 0.2, min: 0, max: 1, step: 0.01 },
//     temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
//   });
  return (
    <mesh
      ref={ringRef}
      geometry={ringMesh.geometry}
      scale={scale}
      position={position}
      rotation={rotation}
    >
       {/* <MeshTransmissionMaterial
        thickness={thickness}
        roughness={roughness}
        transmission={transmission}
        ior={ior}
        chromaticAberration={chromaticAberration}
        anisotropy={anisotropy}
        distortion={distortion}
        distortionScale={distortionScale}
        temporalDistortion={temporalDistortion}
        backside
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
    <mesh ref={cubeRef}  scale={[1.5, 33, 4]} rotation={[0,degToRad(-5),degToRad(63.2)]}>
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
  const ring3Ref = useRef();
  const ring4Ref = useRef();


  const additionalSphere1Ref = useRef();
  const additionalSphere2Ref = useRef();
  const additionalSphere3Ref = useRef();
  const additionalSphere4Ref = useRef();
  const additionalSphere5Ref = useRef();

  const ready = useModelsReady([
    ring1Ref,
    ring2Ref,
    sphereRef,
    cubeRef,
    ring3Ref,
    ring4Ref,
    additionalSphere1Ref,
    additionalSphere2Ref,
    additionalSphere3Ref,
    additionalSphere4Ref,
    additionalSphere5Ref
  ]);

  useEffect(() => {

    if (!ready) return;


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
          )
          

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
    endTrigger: "#section-six", 
    end: "bottom top ",
    scrub: true,
    // markers: true
  },
});

    gsap.to(ring2Ref.current.position, {
      x:39,
      scrollTrigger: {
        trigger:'#section-mid',
        markers:false,
      }
    })

      const tt = gsap.timeline({
          scrollTrigger: {
          trigger:'#section-mid',
          start: '40% 50%',
          end: 'bottom top',
          scrub:true,
          markers: false,
          pin: true,
        }
      })

      gsap.fromTo(
      cubeRef.current.position,
      { y: -35 },   
      { 
        // delay:-1,
        y: -1, 
        ease: "none" ,
        scrollTrigger: {
          trigger:'#section-mid',
          start: '30% 60%',
          end: '40% 60%',
          scrub:true,
          markers: false,
        }
      }
    )

          tt
        //   .to(sphereRef.current.rotation, {
        //   z: `+=${degToRad(360 * 5)}`,
        //   duration: 2,
        //   ease: "none",
        // })

    
    .to(sphereRef.current.position, {
      x: 30,
      y:-15,
      // delay: 0.5,
      duration:2,
      ease:'none'
    }, '<' )
    
    .to(sphereRef.current.position, {
      x: 0, 
    y: -30, 
    delay:0.5,
    ease: "ease" 
    })

    gsap.to(ring2Ref.current.position, {
      y:-22,
      scrollTrigger: {
        trigger: '#section-three'
      }
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
      y: 30,
      delay:1.5,
      ease:'none'
    })

    gsap.to(ring2Ref.current.position, {
      x:0,
      scrollTrigger: {
        trigger: '#section-four'
      }
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
    ease: "none" }  
)

   tl5.to("#light-overlay", {
  opacity: 1,
  scale: 3,
  ease: "power2.inOut",
  duration: 2,
  transformOrigin: "center center"
}, "<")
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
   
    .to(sphereRef.current.scale, {
      x:1.5,
      y:1.5,
      z:1.5,
      duration:0.01,
    }
    )
    
      .to(additionalSphere3Ref.current.position, {
        x:-35,
      },'<')
      .to(additionalSphere4Ref.current.position, {
        x:40,
      },'<')
      .to(additionalSphere4Ref.current.position, {
        y:-28,
      })
      

    const sphereTimeline =gsap.timeline({
        scrollTrigger: {
        trigger:'#section-five',
        start: 'top bottom',
        end: 'bottom top',
        // pin:true,
        scrub: true,
        // markers: true,
      }
       })
      sphereTimeline.to(sphereRef.current.position, {
        y: -17,
        ease:'none'
      })
   
    
    const tl6 = gsap.timeline({
      scrollTrigger: {
        trigger:'#section-five',
        start: 'top bottom',
        end: 'bottom top',
        // pin:true,
        scrub: true,
        // markers: true,
      }
    })


    tl6
    .to(ring2Ref.current.scale, {
        x: 0.025, 
        y: 0.015, 
        z: 0.025,
    })
    .to(ring2Ref.current.rotation, {
        x:0,
        y:degToRad(50),
        z:0
    },'<')
    .to(ring2Ref.current.position, {
      y:-1,
      x:0,
      // duration:0.1,
    }, '<')  
    .to(ring2Ref.current.rotation, {
      y:`+=${degToRad(-10)}}`,
      x:0,
      z:`+=${degToRad(-20)}`
      // delay:0.5,
    })
    .to(ring2Ref.current.rotation, {
      y:`+=${degToRad(-20)}}`,
      // delay:0.2,
      // z:`+=${degToRad(10)}}`
    }, '<')
    .to(ring2Ref.current.position, {
      y:2,
      x:0,
      // duration:0.1,
    })  
    // .to(sphereRef.current.position, {
    //   x:0,
    //   // delay:-0.1,
    //   y:3,
    //   duration:1,
    // }, '<')
    .to(ring2Ref.current.position, {
      y:4,
      // duration:2,
    })

    .fromTo(ring3Ref.current.scale,
  { x: 0, y: 0, z: 0 },
  { x: 0.025, y: 0.015, z: 0.025, duration: 1.5, ease: "power2.out",
    
   },
      '<'
)
  .to(ring3Ref.current.rotation, {
    x:degToRad(30),
    y:degToRad(-35),
    z:degToRad(20),
    delay:0.4,
  }, '<')
  .to(ring2Ref.current.position, {
    y:6
  },'<')
.fromTo(ring4Ref.current.scale,
  { x: 0, y: 0, z: 0 },
  { x: 0.025, y: 0.015, z: 0.015, duration: 1.5, ease: "power2.out" },
    '<' 
)
  .to(ring3Ref.current.position, {
    y:0,
  },'<')

  .to(ring4Ref.current.position, {
    x:0,
    y:-7,
    z:2
  }, '<')

  .to(ring2Ref.current.rotation, {
      x:0,
      y:0,
      z:0
  })
  .to(ring2Ref.current.position, {
    y:15,
    delay:0.2
  },'<')

  .to(ring3Ref.current.position, {
    y:15,
    delay:0.2
  },'<')
  .to(ring4Ref.current.position, {
    y:15,
    delay:0.2
  },'<')
      });

  

      gsap.to([additionalSphere3Ref.current.scale,
      additionalSphere4Ref.current.scale], {
        x:5,
        y:5,
        z:5,
        scrollTrigger: {
          trigger:'#section-six',
          start: 'top bottom',
        }
      })
      gsap.to(sphereRef.current.rotation, {
        z: `+=${degToRad(360 * 10)}`, 
        ease: "none",
        scrollTrigger: {
          trigger: "#section-six",
          start: "top bottom",         
          // endTrigger: "#section-six", 
          end: "bottom top ",
          scrub: true,
        markers: false
  },
});

      const tl7= gsap.timeline({
        scrollTrigger: {
          trigger:'#section-six',
          start:'top top',
          end:'bottom bottom',
          scrub:true,
          // markers:true,
        }
      })


      tl7.to(sphereRef.current.position, {
        y:0,
        ease:'none'
      })
      .to(additionalSphere3Ref.current.position, {
        x:-13,
        y:5,
        z:6,
      })
      .to(additionalSphere4Ref.current.position, {
        x:13,
        y:-5,
        z:6,
      },'<')

      return () => ctx.revert();
    
  }, [ready]);

  return (
    <>
     {!ready && (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="relative flex items-center justify-center">
      {/* Logo in center */}
      <Image
        src="/assets/atom-logo.svg" 
        alt="Logo" 
        width={200}
        height={200}
        className="w-20 h-20 relative z-10"
      />

     
      <div className="absolute w-[15vw] h-[15vw] border-4 border-dotted border-black rounded-full animate-spin-slow"></div>
    </div>
  </div>
)}

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
         <ambientLight intensity={5} />
        
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
          position={[0.5, 0, 1]}
          rotation={[Math.PI / 2, 0, degToRad(50)]}
          />

        <MetallicRingModel
  ringRef={ring3Ref}
  modelPath="/model/ring.glb"
  scale={[0, 0, 0]}
  position={[0, -2, 0]}  
  rotation={[degToRad(0), degToRad(-20), degToRad(-20)]}
/>

<MetallicRingModel
  ringRef={ring4Ref}
  modelPath="/model/ring.glb"
  scale={[0, 0, 0]}
  position={[0, -2, 0]}  
  rotation={[0, 0, degToRad(-20)]}
/>

        <CubeModel cubeRef={cubeRef} />

        {/* <Leva collapsed /> */}

      </Suspense>

      <OrbitControls enableZoom={false} />
    </Canvas>
    </div>
    {/* <Loader /> */}
  </>
  );
};

export default ModelCanvas;
