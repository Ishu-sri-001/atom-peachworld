"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  Environment,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Loader, useProgress } from "@react-three/drei";
import { useControls } from 'leva';
import React, { Suspense, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { degToRad } from "three/src/math/MathUtils";
import * as THREE from "three";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// --------- Helpers ----------
function useModelsReady(dependencies) {
  const { progress } = useProgress();
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    if (progress === 100) {
      const interval = setInterval(() => {
        if (dependencies.every(ref => ref.current)) {
          setReady(true);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [progress, dependencies]);

  return ready;
}

// --------- Light Following Sphere ----------
function LightFollowingSphere({ sphereRef, spotLightRef1, spotLightRef2, pointLightRef1, pointLightRef2 }) {
  useFrame(() => {
    if (!sphereRef.current) return;
    const p = sphereRef.current.position;
    spotLightRef1.current.position.set(p.x, p.y + 10, p.z + 5);
    spotLightRef2.current.position.set(p.x, p.y - 5, p.z + 3);
    pointLightRef1.current.position.set(p.x + 1, p.y - 2.8, p.z + 3.3);
    pointLightRef2.current.position.set(p.x + 1, p.y + 2.8, p.z + 3.3);
  });
  return null;
}

// --------- Sphere Models ----------
function SphereModel({ modelPath, texturePath, sphereRef }) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);
  const sphereMesh = nodes.BlackBall_mesh;

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 1.4,
    roughness: 0.7
  }), [texture]);

  return (
    <mesh ref={sphereRef} geometry={sphereMesh.geometry} scale={1.9} position={[1, 0, 0]} castShadow receiveShadow>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function AdditionalSphere({ position, scale, isTransparent, sphereRef, modelPath, texturePath }) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);
  const sphereMesh = nodes.BlackBall_mesh;

  const materialProps = {
    thickness: 0.25,
    roughness: 0.05,
    transmission: 1.0,
    ior: 0.6,
    chromaticAberration: 1.0,
    backside: true,
    anisotropy: 1.5,
    distortion: 0.6,
    distortionScale: 0.2,
    temporalDistortion: 0,
  };

  return (
    <mesh ref={sphereRef} geometry={sphereMesh.geometry} scale={scale} position={position} castShadow receiveShadow>
      {isTransparent ? (
        <meshPhysicalMaterial
        transmission={1} roughness={0.4} thickness={0.4} ior={1.5} reflectivity={1.5}
         attenuationDistance={1.5} attenuationColor={"white"}
        iridescence={1.0} iridescenceIOR={1.3} iridescenceThicknessRange={[100, 400]}
      />
      ) : (
        <meshStandardMaterial map={texture} color={'grey'} metalness={1.0} roughness={0.7} />
      )}
    </mesh>
  );
}


function TransparentRingModel({ modelPath, scale, position, rotation, ringRef }) {
  const { nodes } = useGLTF(modelPath);
  const ringMesh = nodes.Cylinder;

  return (
    <mesh ref={ringRef} geometry={ringMesh.geometry} scale={scale} position={position} rotation={rotation} castShadow receiveShadow>
      <meshPhysicalMaterial
        transmission={1} roughness={0.1} thickness={0.4} ior={1.5}
        reflectivity={0.8} attenuationDistance={1.5} attenuationColor={"white"}
        iridescence={1.0} iridescenceIOR={1.3} iridescenceThicknessRange={[100, 400]}
      />
    </mesh>
  );
}

function MetallicRingModel({ modelPath, scale, position, rotation, ringRef }) {
  const { nodes } = useGLTF(modelPath);
  const ringMesh = nodes.Cylinder;

  return (
    <mesh ref={ringRef} geometry={ringMesh.geometry} scale={scale} position={position} rotation={rotation} castShadow receiveShadow>
      <meshStandardMaterial
        color="#160936" metalness={1.0} roughness={0.4} envMapIntensity={1.5}
        clearcoat={1.0} clearcoatRoughness={0.0} sheen={1.0} sheenTint={0.5}
        iridescence={1.0} iridescenceIOR={1.5} iridescenceThicknessRange={[200, 800]}
      />
    </mesh>
  );
}

function CubeModel({ cubeRef }) {
  useEffect(() => {
    cubeRef.current.position.set(-5, 5, -1.5);
  }, []);
  return (
    <mesh ref={cubeRef} scale={[1.5, 33, 4]} rotation={[0, degToRad(-5), degToRad(63.2)]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="black" metalness={0.2} roughness={0.9} />
    </mesh>
  );
}


// Preload
useGLTF.preload("/model/sphere.glb");
useGLTF.preload("/model/ring.glb");

function useParallaxMovement(groupRef) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      -mouse.current.x * 2,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      mouse.current.y * 2,
      0.05
    );
    //  groupRef.current.position.x = -mouse.current.x * 2;
    // groupRef.current.position.y = mouse.current.y * 2;
  });
}


function ParallaxGroup({ children }) {
  const groupRef = useRef();
  useParallaxMovement(groupRef);
  return <group ref={groupRef}>{children}</group>;
}



const ModelCanvas = () => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const sphereRef = useRef();
  const cubeRef = useRef();
  const ring3Ref = useRef();
  const ring4Ref = useRef();
  const spotLightRef1 = useRef();
  const spotLightRef2 = useRef();
  const pointLightRef1 = useRef();
  const pointLightRef2 = useRef();
  const additionalSphere1Ref = useRef();
  const additionalSphere2Ref = useRef();
  const additionalSphere3Ref = useRef();
  const additionalSphere4Ref = useRef();
  const additionalSphere5Ref = useRef();

  const groupRef = useRef();

  // useParallaxMovement(groupRef);

  const ready = useModelsReady([
    ring1Ref, ring2Ref, sphereRef, cubeRef, ring3Ref, ring4Ref,
    additionalSphere1Ref, additionalSphere2Ref, additionalSphere3Ref, additionalSphere4Ref, additionalSphere5Ref
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
            end: "+=400",
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
        .to(pointLightRef1.current.position, {
          z: 2.5,
          x:0,
          y:0
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
        scrub:true,
        markers:false,
        duration:0.1,
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

    tt.to(sphereRef.current.position, {
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
      duration:2,
    })
    .to (sphereRef.current.position, {
      y:20,
      // delay:0.5,
      duration:2,
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
      y:5,
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
    y:6.5
  },'<')
.fromTo(ring4Ref.current.scale,
  { x: 0, y: 0, z: 0 },
  { x: 0.025, y: 0.015, z: 0.015, duration: 1.5, ease: "power2.out" },
    '<' 
)
    .to(ring3Ref.current.rotation, {
    
    z:degToRad(60),
    delay:0.4,
  }, '<')
  .to(ring3Ref.current.position, {
    y:0,
  },'<')
  

  .to(ring4Ref.current.position, {
    x:0,
    y:-6,
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
    y:18,
    // delay:0.2
  },'<')
  .to(ring4Ref.current.position, {
    y:15,
    delay:0.1
  },'<')
      });
  

      gsap.to([additionalSphere3Ref.current.scale,
      additionalSphere4Ref.current.scale], {
        x:5,
        y:5,
        z:5,
        duration:0.3,
        scrollTrigger: {
          trigger:'#section-six',
          start: 'top bottom',
          scrub:true,
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
            <Image src="/assets/atom-logo.svg" alt="Logo" width={200} height={200} className="w-20 h-20 relative z-10" />
            <div className="absolute w-[15vw] h-[15vw] border-4 border-dotted border-black rounded-full animate-spin-slow"></div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-20">
        <Canvas
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          style={{ height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, zIndex: 20, pointerEvents: "none" }}
          camera={{ position: [0, 2, 20], fov: 60 }}
        >
          <Suspense fallback={null}>
            <Environment preset="warehouse" background={false} intensity={0.4} />

              <ParallaxGroup>
            <pointLight ref={pointLightRef1} position={[1, -2.8, 3.3]} intensity={12} color="#CF7C00" distance={200} decay={2} />
            <pointLight ref={pointLightRef2} position={[1, 2.8, 3.3]} intensity={12} color="#ffffff" distance={200} decay={2} />

            <spotLight ref={spotLightRef1} position={[0, 10, 5]} intensity={50} angle={Math.PI/2} penumbra={0.4} decay={2} distance={50} color="#ffffff" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <spotLight ref={spotLightRef2} position={[0, -5, 3]} intensity={50} angle={Math.PI/2} penumbra={0.5} decay={2} distance={100} color="#CF7C00" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />

            <directionalLight color="#ffffff" intensity={2} position={[10, 15, 20]} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <directionalLight color="#CF7C00" intensity={5} position={[10, -10, 10]} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />

            <LightFollowingSphere
              sphereRef={sphereRef} spotLightRef1={spotLightRef1} spotLightRef2={spotLightRef2}
              pointLightRef1={pointLightRef1} pointLightRef2={pointLightRef2}
            />

             

            <SphereModel sphereRef={sphereRef} modelPath="/model/sphere.glb" texturePath="/assets/sphere-texture.webp" />

            <AdditionalSphere sphereRef={additionalSphere1Ref} modelPath="/model/sphere.glb" texturePath="/assets/sphere-texture.webp" position={[-4.8, 3, 5.9]} scale={0.7} isTransparent />
            <AdditionalSphere sphereRef={additionalSphere2Ref} modelPath="/model/sphere.glb" texturePath="/assets/sphere-texture.webp" position={[3.5, 1.5, 10]} scale={1.2} isTransparent />
            <AdditionalSphere sphereRef={additionalSphere3Ref} modelPath="/model/sphere.glb" texturePath="/assets/sphere-texture.webp" position={[-9.2, -2, 2]} scale={0.6} isTransparent={false} />
            <AdditionalSphere sphereRef={additionalSphere4Ref} modelPath="/model/sphere.glb" texturePath="/assets/sphere-texture.webp" position={[11, -5, -3]} scale={0.5} isTransparent={false} />
            <AdditionalSphere sphereRef={additionalSphere5Ref} modelPath="/model/sphere.glb" texturePath="/assets/sphere-texture.webp" position={[-5.2, 7, -1]} scale={0.7} isTransparent={false} />

            <TransparentRingModel ringRef={ring1Ref} modelPath="/model/ring.glb" scale={[0.04, 0.015, 0.038]} position={[0, 0.3, -2]} rotation={[0, 0, 0]} />
            <MetallicRingModel ringRef={ring2Ref} modelPath="/model/ring.glb" scale={[0.025, 0.015, 0.03]} position={[0.5, 0, 1]} rotation={[Math.PI / 2, 0, degToRad(50)]} />
            <MetallicRingModel ringRef={ring3Ref} modelPath="/model/ring.glb" scale={[0, 0, 0]} position={[0, -2, 0]} rotation={[degToRad(0), degToRad(-20), degToRad(-20)]} />
            <MetallicRingModel ringRef={ring4Ref} modelPath="/model/ring.glb" scale={[0, 0, 0]} position={[0, -2, 0]} rotation={[0, 0, degToRad(-20)]} />

              </ParallaxGroup>

            <CubeModel cubeRef={cubeRef} />

            <OrbitControls enableZoom={false} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default ModelCanvas;