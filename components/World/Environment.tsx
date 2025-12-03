
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';
import { LANE_WIDTH, COLORS } from '../../types';

const DataParticles: React.FC = () => {
  const speed = useStore(state => state.speed);
  const count = 1500; 
  const meshRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const colorPalette = [
        new THREE.Color(COLORS.text), 
        new THREE.Color(COLORS.teal), 
        new THREE.Color(COLORS.gold),
        new THREE.Color(COLORS.violet),
        new THREE.Color(COLORS.plasma)
    ];
    
    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * 300;
      let y = (Math.random() - 0.5) * 150 + 40; 
      let z = -550 + Math.random() * 650;

      if (Math.abs(x) < 15 && y > -5 && y < 20) {
          if (x < 0) x -= 15;
          else x += 15;
      }

      pos[i * 3] = x;     
      pos[i * 3 + 1] = y; 
      pos[i * 3 + 2] = z; 

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const activeSpeed = speed > 0 ? speed : 2; 

    for (let i = 0; i < count; i++) {
        let z = positions[i * 3 + 2];
        z += activeSpeed * delta * 1.5; 
        
        if (z > 100) {
            z = -550 - Math.random() * 50; 
            
            let x = (Math.random() - 0.5) * 300;
            let y = (Math.random() - 0.5) * 150 + 40;
            
            if (Math.abs(x) < 15 && y > -5 && y < 20) {
                if (x < 0) x -= 15;
                else x += 15;
            }

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
        }
        positions[i * 3 + 2] = z;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

const CircuitGuides: React.FC = () => {
    const { laneCount } = useStore();
    
    const separators = useMemo(() => {
        const lines: number[] = [];
        const startX = -(laneCount * LANE_WIDTH) / 2;
        
        for (let i = 0; i <= laneCount; i++) {
            lines.push(startX + (i * LANE_WIDTH));
        }
        return lines;
    }, [laneCount]);

    return (
        <group position={[0, 0.02, 0]}>
            {/* Dark Floor */}
            <mesh position={[0, -0.05, -20]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[laneCount * LANE_WIDTH, 200]} />
                <meshStandardMaterial color={COLORS.background} roughness={0.9} metalness={0.1} />
            </mesh>

            {/* Glowing Lines */}
            {separators.map((x, i) => (
                <mesh key={`sep-${i}`} position={[x, 0, -20]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.08, 200]} /> 
                    <meshBasicMaterial 
                        color={COLORS.structure} 
                        transparent 
                        opacity={0.8} 
                    />
                </mesh>
            ))}
        </group>
    );
};

// Represents the Central Network Core
const NetworkCore: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <group position={[0, 40, -180]}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[40, 2]} />
                <meshBasicMaterial 
                    color={COLORS.text} 
                    wireframe 
                    transparent 
                    opacity={0.1} 
                />
            </mesh>
            {/* Inner Glow */}
            <mesh>
                 <sphereGeometry args={[30, 32, 32]} />
                 <meshBasicMaterial color={COLORS.background} />
            </mesh>
             <pointLight intensity={2} color={COLORS.gold} distance={300} decay={2} />
             <pointLight intensity={1} color={COLORS.violet} distance={300} decay={2} position={[20, 0, 0]} />
        </group>
    );
};

const MovingGrid: React.FC = () => {
    const speed = useStore(state => state.speed);
    const meshRef = useRef<THREE.Mesh>(null);
    const offsetRef = useRef(0);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
             const activeSpeed = speed > 0 ? speed : 5;
             offsetRef.current += activeSpeed * delta;
             const cellSize = 10;
             const zPos = -100 + (offsetRef.current % cellSize);
             meshRef.current.position.z = zPos;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -100]}>
            <planeGeometry args={[300, 400, 30, 40]} />
            <meshBasicMaterial 
                color={COLORS.structure} 
                wireframe 
                transparent 
                opacity={0.15} 
            />
        </mesh>
    );
};

export const Environment: React.FC = () => {
  return (
    <>
      <color attach="background" args={[COLORS.background]} />
      <fog attach="fog" args={[COLORS.background, 40, 160]} />
      
      <ambientLight intensity={0.5} color={COLORS.structure} />
      <directionalLight position={[10, 20, 10]} intensity={2.0} color={COLORS.text} />
      <pointLight position={[0, 20, -100]} intensity={1.5} color={COLORS.teal} distance={200} decay={2} />
      
      <DataParticles />
      <MovingGrid />
      <CircuitGuides />
      
      <NetworkCore />
    </>
  );
};
