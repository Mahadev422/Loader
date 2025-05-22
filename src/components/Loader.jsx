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
    ref.current.rotation.x += delta * 3;
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

  return (
    <animated.mesh>
      <sphereGeometry args={[0.2, 32, 32]} />
      <animated.meshBasicMaterial
        color="#93c5fd"
        transparent
        opacity={2}
      />
    </animated.mesh>
  );
}


export default function Loader() {

  return (
    <AnimatePresence>
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
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
}
