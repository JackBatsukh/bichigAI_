"use client";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Group } from "three";

useGLTF.preload("/robot_playground.glb");

const Model = React.forwardRef<Group, {}>((props, ref) => {
  const group = useRef<Group | null>(null);
  const { animations, scene } = useGLTF("/robot_playground.glb");
  const { actions } = useAnimations(animations, group);
  const animationRef = useRef(0);

  useEffect(() => {
    if (actions["Experiment"]) {
      actions["Experiment"].play();
    }
  }, [actions]);

  useFrame((_, delta) => {
    if (actions["Experiment"]) {
      // Get the duration of the animation
      const duration = actions["Experiment"].getClip().duration;
      // Increment the animation time
      animationRef.current += delta;
      // Loop the animation
      actions["Experiment"].time = animationRef.current % duration;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
});

Model.displayName = "Model";

export default Model;
