/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';
import { LANE_WIDTH } from '../../types';

// Urban Environment for Capitão Verde Run
// Replaces space/synthwave theme with eco-city theme

const UrbanParticles: React.FC = () => {
    // Replace stars with urban particles (leaves, birds, butterflies)
    const speed = useStore(state => state.speed);
    const count = 300; // Fewer particles than stars
    const meshRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            let x = (Math.random() - 0.5) * 400;
            let y = Math.random() * 80 + 5; // Floating above ground
            let z = -550 + Math.random() * 650;

            // Exclude from play area
            if (Math.abs(x) < 15 && y > -5 && y < 20) {
                if (x < 0) x -= 15;
                else x += 15;
            }

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const activeSpeed = speed > 0 ? speed : 2;

        for (let i = 0; i < count; i++) {
            let z = positions[i * 3 + 2];
            z += activeSpeed * delta * 1.5; // Slower than stars

            // Gentle floating motion
            positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;

            if (z > 100) {
                z = -550 - Math.random() * 50;

                let x = (Math.random() - 0.5) * 400;
                let y = Math.random() * 80 + 5;

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
            </bufferGeometry>
            <pointsMaterial
                size={1.2}
                color="#4ade80" // Green leaves
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

const LaneGuides: React.FC = () => {
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
            {/* Urban Street Floor - Green ecological path */}
            <mesh position={[0, -0.02, -20]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[laneCount * LANE_WIDTH, 200]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.8} /> {/* Eco green path */}
            </mesh>

            {/* Lane Separators - White sustainable markings */}
            {separators.map((x, i) => (
                <mesh key={`sep-${i}`} position={[x, 0, -20]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.08, 200]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            ))}
        </group>
    );
};

const UrbanSkyline: React.FC = () => {
    // Replace RetroSun with simplified city skyline backdrop
    const groupRef = useRef<THREE.Group>(null);
    const texture = useLoader(THREE.TextureLoader, './city_background.png');

    useFrame((state) => {
        // Gentle sway for clouds or parallax effect could be added here
        if (groupRef.current) {
            // Parallax effect based on camera movement or time
            groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 5;
        }
    });

    return (
        <group ref={groupRef} position={[0, 40, -250]}>
            {/* Background Image Plane */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[600, 150]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={1}
                />
            </mesh>
        </group>
    );
};

const UrbanGround: React.FC = () => {
    // Replace purple grid with asphalt/concrete street
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
                color="#6b7280" // Asphalt gray
                wireframe
                transparent
                opacity={0.2}
            />
        </mesh>
    );
};

export const Environment: React.FC = () => {
    return (
        <>
            {/* Sky blue background instead of dark purple */}
            <color attach="background" args={['#bae6fd']} /> {/* Light sky blue */}
            <fog attach="fog" args={['#bae6fd', 40, 180]} />

            {/* Natural daylight instead of neon lights */}
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight position={[50, 80, -30]} intensity={1.2} color="#fef3c7" /> {/* Warm sunlight */}
            <hemisphereLight groundColor="#86efac" color="#7dd3fc" intensity={0.4} />

            <UrbanParticles />
            <UrbanGround />
            <LaneGuides />
            <UrbanSkyline />
        </>
    );
};
