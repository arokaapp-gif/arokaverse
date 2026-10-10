
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function AvatarCharacter() {
  return (
    <group position={[0, -0.65, 0]}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.38, 0.65, 8, 16]} />
        <meshStandardMaterial
          color="#a78bfa"
          roughness={0.65}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 24]} />
        <meshStandardMaterial color="#e8b49c" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.43, 32, 32]} />
        <meshStandardMaterial
          color="#f0c3a8"
          roughness={0.75}
        />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.68, -0.025]} castShadow>
        <sphereGeometry
          args={[0.435, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.48]}
        />
        <meshStandardMaterial color="#30233d" roughness={0.9} />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.15, 1.45, 0.365]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#241b2c" />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.15, 1.45, 0.365]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#241b2c" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 1.28, 0.375]}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshStandardMaterial color="#a94f62" />
        <group scale={[1, 0.25, 0.5]} />
      </mesh>

      {/* Arms */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.47, 0.55, 0]}
          rotation={[0, 0, side * -0.18]}
          castShadow
        >
          <capsuleGeometry args={[0.105, 0.48, 6, 12]} />
          <meshStandardMaterial color="#e8b49c" />
        </mesh>
      ))}

      {/* Legs */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.18, -0.12, 0]}
          castShadow
        >
          <capsuleGeometry args={[0.14, 0.48, 6, 12]} />
          <meshStandardMaterial color="#303b64" />
        </mesh>
      ))}
    </group>
  );
}

export default function Avatar3D() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.1, 4.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2.2}
          castShadow
        />

        <pointLight
          position={[-3, 2, -2]}
          intensity={35}
          color="#b9a3ff"
        />

        <AvatarCharacter />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.8, 0]}
          receiveShadow
        >
          <circleGeometry args={[2.5, 64]} />
          <meshStandardMaterial
            color="#252443"
            roughness={0.9}
          />
        </mesh>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.6, 0]}
        />
      </Canvas>
    </div>
  );
}
