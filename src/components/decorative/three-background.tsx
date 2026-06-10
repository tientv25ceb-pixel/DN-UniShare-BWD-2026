'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { usePathname } from 'next/navigation';
import ImpactGlobe from './impact-globe';

const COLORS = ['#3b82f6', '#60a5fa', '#818cf8', '#a78bfa', '#22d3ee'];

/* ==================== DEFAULT / FALLBACK SPACE BACKGROUND ==================== */
function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const count = 1200;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.02 + Math.random() * 0.12;

      const c = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useGSAP(() => {
    gsap.to(ref.current.rotation, {
      y: Math.PI * 2,
      duration: 240,
      repeat: -1,
      ease: 'none',
    });
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Nebula() {
  const ref = useRef<THREE.Points>(null!);
  const count = 400;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      const c = new THREE.Color().lerpColors(
        new THREE.Color('#3b82f6'),
        new THREE.Color('#8b5cf6'),
        t
      );
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useGSAP(() => {
    gsap.to(ref.current.rotation, {
      y: Math.PI * 2,
      duration: 120,
      repeat: -1,
      ease: 'none',
    });
    gsap.to(ref.current.material, {
      opacity: 0.2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireframeShapes() {
  const groupRef = useRef<THREE.Group>(null!);

  useGSAP(() => {
    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 60,
      repeat: -1,
      ease: 'none',
    });
    gsap.to(groupRef.current.rotation, {
      x: 0.5,
      z: 0.3,
      duration: 30,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-6, 3, -4]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshPhongMaterial color="#60a5fa" transparent opacity={0.08} wireframe depthWrite={false} />
      </mesh>
      <mesh position={[5, -3, -6]}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshPhongMaterial color="#818cf8" transparent opacity={0.06} wireframe depthWrite={false} />
      </mesh>
      <mesh position={[0, 4, -10]}>
        <torusKnotGeometry args={[1.2, 0.4, 48, 12]} />
        <meshPhongMaterial color="#3b82f6" transparent opacity={0.07} wireframe depthWrite={false} />
      </mesh>
      <mesh position={[-4, -4, -8]}>
        <octahedronGeometry args={[1.3, 0]} />
        <meshPhongMaterial color="#a78bfa" transparent opacity={0.05} wireframe depthWrite={false} />
      </mesh>
      <mesh position={[7, 1, -5]}>
        <torusGeometry args={[1.8, 0.05, 16, 48]} />
        <meshPhongMaterial color="#22d3ee" transparent opacity={0.04} wireframe depthWrite={false} />
      </mesh>
    </group>
  );
}

function FloatingRings() {
  const groupRef = useRef<THREE.Group>(null!);

  useGSAP(() => {
    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 80,
      repeat: -1,
      ease: 'none',
    });
    gsap.to(groupRef.current.position, {
      y: 1.5,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <ringGeometry args={[3.5, 3.8, 64]} />
        <meshPhongMaterial color="#3b82f6" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]} position={[0, 0, -5]}>
        <ringGeometry args={[4.5, 4.8, 64]} />
        <meshPhongMaterial color="#818cf8" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GlowCore() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useGSAP(() => {
    gsap.to(meshRef.current.scale, {
      x: 1.08,
      y: 1.08,
      z: 1.08,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to(meshRef.current.material, {
      opacity: 0.06,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[1.5, 24, 24]} />
      <meshPhongMaterial
        color="#3b82f6"
        emissive="#60a5fa"
        emissiveIntensity={0.5}
        transparent
        opacity={0.06}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ==================== CAMERA CONTROLLER ==================== */
function CameraController() {
  const { camera } = useThree();

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(camera.position, {
      x: 2.5, y: 1.2, z: 15,
      duration: 35,
      ease: 'sine.inOut',
    });
    tl.to(camera.position, {
      x: -1.5, y: -0.8, z: 13,
      duration: 35,
      ease: 'sine.inOut',
    });
  });

  useGSAP(() => {
    gsap.to(camera, {
      zoom: 1.02,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#818cf8" />
      <directionalLight position={[0, 5, 0]} intensity={0.2} color="#60a5fa" />
    </>
  );
}

/* ==================== 1. RADAR SCENE (/radar) ==================== */
function RadarScene() {
  const ringsCount = 4;
  const sweepRef = useRef<THREE.Mesh>(null!);
  const blipsCount = 12;

  const blips = useMemo(() => {
    const arr: { x: number; y: number; z: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < blipsCount; i++) {
      const r = 2.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() - 0.5) * 1.5;
      arr.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 1.2 });
    }
    return arr;
  }, []);

  useGSAP(() => {
    gsap.to(sweepRef.current.rotation, {
      y: Math.PI * 2,
      duration: 6.5,
      repeat: -1,
      ease: 'none',
    });
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 6, 0]} intensity={1.2} color="#00ffcc" />
      
      {/* Concentric Radar Rings */}
      {Array.from({ length: ringsCount }).map((_, i) => {
        const radius = (i + 1) * 2;
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.075 / (i * 0.55 + 1)} side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* Radar Center */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.06, 32]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.4} />
      </mesh>

      {/* Crosshair grids */}
      <gridHelper args={[16, 8, 0x00ffcc, 0x00ffcc]} position={[0, -0.01, 0]} />

      {/* Rotating Sweep Plane */}
      <group ref={sweepRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0, 8, 32, 1, 0, Math.PI / 3]} />
          <meshBasicMaterial
            color="#00ffbb"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Radar Blips */}
      {blips.map((blip, i) => (
        <BlipDot key={i} blip={blip} />
      ))}
      
      <CameraController />
    </>
  );
}

function BlipDot({ blip }: { blip: any }) {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = blip.y + Math.sin(t * blip.speed + blip.phase) * 0.08;
    const scale = 1 + Math.sin(t * 2.5 + blip.phase) * 0.15;
    ref.current.scale.setScalar(scale);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + Math.sin(t * 2.5 + blip.phase) * 0.15;
  });

  return (
    <mesh ref={ref} position={[blip.x, blip.y, blip.z]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color="#00ffcc" transparent opacity={0.4} />
    </mesh>
  );
}

/* ==================== 2. CHAT SCENE (/chat) ==================== */
function ChatScene() {
  const count = 35;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 7;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.006
      });
    }
    return { arr, velocities };
  }, []);

  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pts = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const vels = positions.velocities;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pts[i3] += vels[i].x;
      pts[i3 + 1] += vels[i].y;
      pts[i3 + 2] += vels[i].z;

      if (Math.abs(pts[i3]) > 6.5) vels[i].x *= -1;
      if (Math.abs(pts[i3 + 1]) > 4.5) vels[i].y *= -1;
      if (Math.abs(pts[i3 + 2]) > 4.5) vels[i].z *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    const lineCoords: number[] = [];
    const maxDist = 3.2;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x1 = pts[i3], y1 = pts[i3 + 1], z1 = pts[i3 + 2];
      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        const x2 = pts[j3], y2 = pts[j3 + 1], z2 = pts[j3 + 2];
        const dist = Math.sqrt((x1-x2)**2 + (y1-y2)**2 + (z1-z2)**2);
        if (dist < maxDist) {
          lineCoords.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }
    
    if (linesRef.current) {
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(lineCoords), 3)
      );
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions.arr, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#3b82f6"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </lineSegments>

      <CameraController />
    </>
  );
}

/* ==================== 3. FAVORITES SCENE (/favorites) ==================== */
function FavoritesScene() {
  const count = 90;
  
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const warmColors = ['#ec4899', '#f43f5e', '#fb7185', '#fcd34d', '#f472b6'];

    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 7.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      sizes[i] = 0.05 + Math.random() * 0.12;
      
      const c = new THREE.Color(warmColors[Math.floor(Math.random() * warmColors.length)]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ec4899" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#fcd34d" />
      
      <points ref={ref} geometry={geometry}>
        <pointsMaterial
          size={0.13}
          vertexColors
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {Array.from({ length: 4 }).map((_, i) => (
        <FloatingSoftSphere key={i} idx={i} />
      ))}

      <CameraController />
    </>
  );
}

function FloatingSoftSphere({ idx }: { idx: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const pos = useMemo(() => [
    (Math.random() - 0.5) * 7,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.25 + idx;
    ref.current.position.y = pos[1] + Math.sin(t) * 0.4;
    ref.current.position.x = pos[0] + Math.cos(t * 0.7) * 0.25;
    ref.current.rotation.y = t * 0.4;
  });

  const colors = ['#fda4af', '#f472b6', '#fbcfe8', '#fef08a'];

  return (
    <mesh ref={ref} position={pos as [number, number, number]}>
      <dodecahedronGeometry args={[0.35 + idx * 0.08, 0]} />
      <meshPhongMaterial
        color={colors[idx % colors.length]}
        transparent
        opacity={0.05}
        wireframe
        depthWrite={false}
      />
    </mesh>
  );
}

/* ==================== 4. DISCOVERY SCENE (/items) ==================== */
function DiscoveryScene() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={0.85} color="#3b82f6" />
      <pointLight position={[-5, -3, -5]} intensity={0.45} color="#10b981" />

      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingItemShape key={i} idx={i} />
      ))}

      <CameraController />
    </>
  );
}

function FloatingItemShape({ idx }: { idx: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const info = useMemo(() => {
    const x = (Math.random() - 0.5) * 11;
    const y = (Math.random() - 0.5) * 7;
    const z = -3 - Math.random() * 5;
    const type = idx % 3; // 0: box, 1: torus, 2: octahedron
    const size = 0.45 + Math.random() * 0.7;
    const speed = 0.2 + Math.random() * 0.35;
    const color = ['#60a5fa', '#34d399', '#818cf8', '#a78bfa'][idx % 4];
    return { x, y, z, type, size, speed, color, rotSpeed: 0.1 + Math.random() * 0.25 };
  }, [idx]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * info.speed;
    ref.current.position.y = info.y + Math.sin(t) * 0.5;
    ref.current.position.x = info.x + Math.cos(t * 0.65) * 0.35;
    ref.current.rotation.x = t * info.rotSpeed;
    ref.current.rotation.y = t * (info.rotSpeed * 1.3);
  });

  return (
    <mesh ref={ref} position={[info.x, info.y, info.z]}>
      {info.type === 0 && <boxGeometry args={[info.size, info.size, info.size]} />}
      {info.type === 1 && <torusGeometry args={[info.size * 0.45, info.size * 0.12, 8, 24]} />}
      {info.type === 2 && <octahedronGeometry args={[info.size * 0.55]} />}
      <meshPhongMaterial
        color={info.color}
        transparent
        opacity={0.05}
        wireframe
        depthWrite={false}
      />
    </mesh>
  );
}

/* ==================== MAIN SCENE RESOLVER ==================== */
function Scene() {
  const pathname = usePathname();

  if (pathname === '/radar') {
    return <RadarScene />;
  }
  if (pathname === '/chat') {
    return <ChatScene />;
  }
  if (pathname === '/favorites') {
    return <FavoritesScene />;
  }
  if (pathname === '/items') {
    return <DiscoveryScene />;
  }

  // Default space background for all other pages
  return (
    <>
      <Stars />
      <Nebula />
      <GlowCore />
      <FloatingRings />
      <WireframeShapes />
      <CameraController />
      <Lights />
    </>
  );
}

/* ==================== EXPORT COMPONENT ==================== */
export default function ThreeBackground() {
  const pathname = usePathname();

  // Hide ThreeBackground on the homepage (the 3D globe is active there)
  if (pathname === '/') return null;

  // Render the Sustainability Impact Globe for the impact page
  if (pathname === '/impact') {
    return (
      <ImpactGlobe className="fixed inset-0 w-screen h-screen z-0 pointer-events-none opacity-40" />
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
