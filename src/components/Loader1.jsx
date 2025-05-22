import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function LightBeam() {
  const ref = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.7 + Math.sin(t * 3) * 1; // Pulses size between 0.8 to 1.2
    const opacity = 0.5 + Math.sin(t * 3) * 0.5; // Pulses opacity between 0.1 to 0.4

    ref.current.scale.set(pulse, pulse, pulse);

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color="red"
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}


function OrbitingParticles({ count = 20 }) {
  const group = useRef();
  const radius = 0.2;

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

export default function Loader1() {
  const [loading, setLoading] = useState(true);

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
            <OrbitingParticles />
            <LightBeam />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
