"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

type Point = [number, number];

const cssVar = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};

const smooth = (points: Point[]): Point[] =>
  new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)))
    .getPoints(48)
    .map((p) => [p.x, p.y] as Point);

const lathe = (points: Point[]) =>
  new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    72
  );

function Bottle({ gold }: { gold: string }) {
  const bodyGeometry = useMemo(
    () =>
      lathe([
        [0, 0],
        [0.6, 0],
        ...smooth([
          [1.0, 0],
          [1.15, 0.15],
          [1.17, 0.5],
          [1.17, 1.6],
          [1.1, 1.95],
          [0.75, 2.15],
          [0.42, 2.25],
          [0.4, 2.4],
        ]),
      ]),
    []
  );

  const liquidGeometry = useMemo(
    () =>
      lathe([
        [0, 0.1],
        [0.5, 0.1],
        ...smooth([
          [0.98, 0.1],
          [1.07, 0.25],
          [1.08, 0.5],
          [1.08, 1.45],
          [1.0, 1.7],
          [0.7, 1.85],
        ]),
        [0, 1.85],
      ]),
    []
  );

  return (
    <group position={[0, -1.75, 0]}>
      <mesh geometry={liquidGeometry}>
        <meshStandardMaterial
          color="#c8921f"
          roughness={0.2}
          metalness={0.25}
          emissive="#7a4a05"
          emissiveIntensity={0.35}
        />
      </mesh>

      <mesh geometry={bodyGeometry}>
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          thickness={0.8}
          roughness={0.04}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.4}
          attenuationColor={gold}
          attenuationDistance={4}
        />
      </mesh>

      <mesh position={[0, 2.42, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.14, 64]} />
        <meshStandardMaterial
          color={gold}
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.6}
        />
      </mesh>

      <mesh position={[0, 2.925, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.95, 64]} />
        <meshStandardMaterial
          color={gold}
          metalness={1}
          roughness={0.22}
          envMapIntensity={1.6}
        />
      </mesh>

      <mesh position={[0, 3.46, 0]}>
        <cylinderGeometry args={[0.38, 0.46, 0.12, 64]} />
        <meshStandardMaterial
          color={gold}
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

type Props = {
  active: boolean;
  reduceMotion: boolean;
};

export default function ProductScene3D({ active, reduceMotion }: Props) {
  const gold = useMemo(() => cssVar("--color-gold-base", "#d4a93a"), []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 8.5], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.25} />

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="rect"
            intensity={4}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            form="rect"
            intensity={3}
            position={[-5, 1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            form="ring"
            color={gold}
            intensity={6}
            position={[10, 5, 0]}
            scale={8}
          />
          <Lightformer
            form="circle"
            intensity={2}
            position={[5, -1, -1]}
            scale={3}
          />
        </group>
      </Environment>

      <Float
        speed={reduceMotion ? 0 : 1.5}
        rotationIntensity={reduceMotion ? 0 : 0.35}
        floatIntensity={reduceMotion ? 0 : 0.6}
      >
        <Bottle gold={gold} />
      </Float>

      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.6}
        scale={9}
        blur={2.6}
        far={4}
        color="#000000"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduceMotion}
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
