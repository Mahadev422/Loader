import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

function OuterRing() {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 2;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.25, 0.03, 64, 128]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={1}
        metalness={10}
      />
    </mesh>
  );
}

function InnerRing() {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 2;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.2, 0.03, 64, 128]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#60a5fa"
        emissiveIntensity={1.2}
        metalness={8}
        roughness={0.2}
      />
    </mesh>
  );
}

// ✅ Animated glowing inner sphere
function InnerGlowSphere() {
  const [show, setShow] = useState(false);

  const { scale, opacity } = useSpring({
    scale: show ? [1, 1, 1] : [0, 0, 0],
    opacity: show ? 0.3 : 0,
    config: { mass: 1, tension: 200, friction: 18 },
    loop: show
      ? {
          reverse: true,
        }
      : false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300); // appear with delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <animated.mesh scale={scale}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <animated.meshBasicMaterial
        color="#93c5fd"
        transparent
        opacity={opacity}
      />
    </animated.mesh>
  );
}

function LightBeam() {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.material.opacity = 0.2 + 0.1 * Math.sin(Date.now() * 0.003);
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 2.2, 32]} />
      <meshBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitingParticles({ count = 12 }) {
  const group = useRef();
  const radius = 0.3;

  const angles = Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    angles.forEach((angle, i) => {
      const mesh = group.current.children[i];
      mesh.position.set(
        Math.cos(angle + t) * radius,
        Math.sin(angle + t) * radius,
        0
      );
    });
  });

  return (
    <group ref={group}>
      {angles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#3b82f6" metalness={6}/>
        </mesh>
      ))}
    </group>
  );
}

export default function Loader() {
  const [loading, setLoading] = useState(true);

  // Optional: Auto-hide loader after some time
  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 4000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[2, 2, 2]} intensity={2} />

            <OuterRing />
            <InnerRing />
            <InnerGlowSphere />
            <LightBeam />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
