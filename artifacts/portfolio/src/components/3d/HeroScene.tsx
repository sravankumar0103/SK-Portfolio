import React, { Suspense, useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function RotatingShapes({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (group.current) {
      // Mouse parallax
      const targetX = (mousePosition.current.x * Math.PI) / 36; // max +-5 degrees
      const targetY = (mousePosition.current.y * Math.PI) / 36;
      group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetY - group.current.rotation.x) * 0.05;
    }
    if (mesh1.current) {
      mesh1.current.rotation.x += 0.002;
      mesh1.current.rotation.y += 0.003;
    }
    if (mesh2.current) {
      mesh2.current.rotation.x -= 0.004;
      mesh2.current.rotation.y += 0.002;
    }
  });

  const material = new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1,
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={mesh1} position={[1, 0, 0]} material={material}>
          <icosahedronGeometry args={[1.8, 2]} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={mesh2} position={[-2, -1, -2]} material={material}>
          <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
        </mesh>
      </Float>
      {/* Scattered small spheres */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 8, 
              (Math.random() - 0.5) * 8, 
              (Math.random() - 0.5) * 8 - 2
            ]} 
            material={material}
          >
            <sphereGeometry args={[0.1 + Math.random() * 0.15, 32, 32]} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function CSSFallbackBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-background overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 70% 30%, rgba(201, 169, 110, 0.05) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)'
      }} />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
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
  const mousePosition = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mousePosition.current = { x, y };
  };

  return (
    <WebGLErrorBoundary>
      <div className="absolute inset-0 z-0 bg-background" onPointerMove={handlePointerMove}>
        <Canvas
          onCreated={({ gl }) => {
            if (!gl || !gl.getContext()) {
              throw new Error('WebGL not available');
            }
          }}
          gl={{ failIfMajorPerformanceCaveat: false, antialias: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f0f0f0" />
          <fog attach="fog" args={['#080808', 8, 25]} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <RotatingShapes mousePosition={mousePosition} />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
