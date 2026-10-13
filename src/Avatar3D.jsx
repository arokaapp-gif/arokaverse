
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/avatar.glb';

function AvatarModel({ modelUrl = MODEL_URL }) {
  const { scene } = useGLTF(modelUrl);

  const model = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        if (object.material) {
          object.material = Array.isArray(object.material)
            ? object.material.map((material) => material.clone())
            : object.material.clone();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            if ('roughness' in material && material.roughness == null) {
              material.roughness = 0.7;
            }
          });
        }
      }
    });

    return clonedScene;
  }, [scene]);

  const { position, scale } = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const height = size.y || 1;
    const fitScale = 2.5 / height;

    return {
      position: [
        -center.x * fitScale,
        -bounds.min.y * fitScale - 1,
        -center.z * fitScale,
      ],
      scale: fitScale,
    };
  }, [model]);

  return (
    <primitive
      object={model}
      position={position}
      scale={scale}
    />
  );
}

function LoadingIndicator() {
  return (
    <Html center>
      <div
        style={{
          color: '#ffffff',
          background: 'rgba(15, 18, 35, 0.88)',
          border: '1px solid rgba(167, 139, 250, 0.4)',
          padding: '12px 18px',
          borderRadius: '12px',
          fontSize: '14px',
          whiteSpace: 'nowrap',
        }}
      >
        Loading your avatar...
      </div>
    </Html>
  );
}

function AvatarScene({ modelUrl }) {
  return (
    <>
      <color attach="background" args={['#111225']} />

      <fog attach="fog" args={['#111225', 8, 18]} />

      <ambientLight intensity={0.8} />

      <hemisphereLight
        skyColor="#d9dcff"
        groundColor="#29213d"
        intensity={1.1}
      />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight
        position={[-3, 2.5, -2]}
        intensity={18}
        color="#9d83ff"
        distance={10}
      />

      <pointLight
        position={[3, 2, 2]}
        intensity={8}
        color="#75d8ff"
        distance={8}
      />

      <Suspense fallback={<LoadingIndicator />}>
        <AvatarModel modelUrl={modelUrl} />

        <Environment preset="city" />

        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.5}
          scale={4}
          blur={2.5}
          far={4}
          resolution={512}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.2}
        maxDistance={6}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0.35, 0]}
      />
    </>
  );
}

export default function Avatar3D({
  modelUrl = MODEL_URL,
  height = '480px',
  showControls = true,
}) {
  const [modelFailed, setModelFailed] = useState(false);

  useEffect(() => {
    setModelFailed(false);
  }, [modelUrl]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        minHeight: '360px',
        overflow: 'hidden',
        borderRadius: '20px',
        background:
          'radial-gradient(circle at 50% 25%, #29254b 0%, #111225 65%, #090a15 100%)',
      }}
    >
      {!modelFailed ? (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [0, 1.15, 4.2],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          onError={() => setModelFailed(true)}
        >
          <AvatarScene modelUrl={modelUrl} />
        </Canvas>
      ) : (
        <div
          style={{
            height: '100%',
            minHeight: '360px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>
              👤
            </div>
            <strong>Avatar could not be loaded</strong>
            <p style={{ color: '#b8b8d4', fontSize: '14px' }}>
              Check that public/models/avatar.glb exists and is a valid
              3D model.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#8b5cf6',
                color: '#ffffff',
                border: 0,
                borderRadius: '10px',
                padding: '10px 16px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {showControls && !modelFailed && (
        <div
          style={{
            position: 'absolute',
            left: '12px',
            right: '12px',
            bottom: '12px',
            textAlign: 'center',
            color: '#e8e6ff',
            fontSize: '12px',
            pointerEvents: 'none',
            textShadow: '0 1px 5px #000000',
          }}
        >
          Drag to rotate · Scroll to zoom
        </div>
      )}
    </div>
  );
}

useGLTF.preload(MODEL_URL);
