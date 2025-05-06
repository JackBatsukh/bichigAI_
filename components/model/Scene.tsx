"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Model from "./Model";
import { Suspense } from "react";
import { useProgress, Html, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Loader() {
  const { progress, active } = useProgress();

  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}

function AnimatedModel() {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      // Rotate the model continuously
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return <Model ref={modelRef} />;
}

export default function Scene() {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} className="relative h-svh ">
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, -5, 5]} intensity={4} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Suspense fallback={<Loader />}>
        <AnimatedModel />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Suspense>
    </Canvas>
  );
}
