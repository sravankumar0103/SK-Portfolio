import React, { Suspense, useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function RotatingShapes() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      group.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-3, 1, -2]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#00ffff" wireframe emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[3, -1, -3]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#8a2be2" wireframe emissive="#8a2be2" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[0, -2, 2]}>
          <torusGeometry args={[0.8, 0.2, 16, 100]} />
          <meshStandardMaterial color="#00ffff" wireframe emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

function CSSFallbackBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-background overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(0,255,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(138,43,226,0.08) 0%, transparent 60%)'
      }} />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute border border-cyan-500/20 rounded-full"
          style={{
            width: `${120 + i * 80}px`,
            height: `${120 + i * 80}px`,
            top: `${10 + i * 12}%`,
            left: `${5 + i * 15}%`,
            animation: `spin ${8 + i * 3}s linear infinite`,
            opacity: 0.3 - i * 0.04,
          }}
        />
      ))}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-violet-500/15 rotate-45 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-cyan-500/15 rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />
      {[...Array(30)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <CSSFallbackBackground />;
    }
    return this.props.children;
  }
}

export function HeroScene() {
  return (
    <WebGLErrorBoundary>
      <div className="absolute inset-0 z-0 bg-background pointer-events-none">
        <Canvas
          onCreated={({ gl }) => {
            if (!gl || !gl.getContext()) {
              throw new Error('WebGL not available');
            }
          }}
          gl={{ failIfMajorPerformanceCaveat: false }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Suspense fallback={null}>
            <RotatingShapes />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
