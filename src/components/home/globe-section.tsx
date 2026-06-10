'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const R = 5;                       // Globe Radius
const STAR_N  = 3000;              // Stars count
const EPS = 0.001;                 // Avoid zero geometries

// Geographic coordinates to 3D Vector3
function ll2v(lat: number, lon: number, r: number) {
  const p = ((90 - lat) * Math.PI) / 180;
  const t = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(p) * Math.cos(t),
    r * Math.cos(p),
    r * Math.sin(p) * Math.sin(t)
  );
}

export default function GlobeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Initial camera position pointing directly at Vietnam, zoomed out (11.5)
    const initCamPos = ll2v(16.0544, 108.2022, 11.5);
    camera.position.copy(initCamPos);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp' // Force high shader precision for maximum sharpness
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Lock pixel ratio to device ratio (perfect Retina/High-DPI sharpness)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTS
    scene.add(new THREE.AmbientLight(0x1a2b4c, 1.5));

    const sun = new THREE.DirectionalLight(0xfff5ea, 3.5);
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0x0088ff, 1.2);
    rimLight.position.set(-10, -5, -10);
    scene.add(rimLight);

    // GLOBE GROUP
    const globe = new THREE.Group();
    scene.add(globe);

    /* ---- Star Background ---- */
    const starGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(STAR_N * 3);
    const sSiz = new Float32Array(STAR_N);
    for (let i = 0; i < STAR_N; i++) {
      const r = 80 + Math.random() * 150;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sPos[i * 3 + 1] = r * Math.cos(ph);
      sPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      sSiz[i] = 0.4 + Math.random() * 1.2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('aStarSize', new THREE.BufferAttribute(sSiz, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aStarSize;
        varying float vB;
        uniform float uTime;
        void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vB = .5 + .5*sin(uTime*.4 + position.x*8.0 + position.y*6.0);
            gl_PointSize = aStarSize * (80.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vB;
        void main(){
            float d = length(gl_PointCoord - vec2(.5));
            if(d>.5) discard;
            float a = smoothstep(.5,.0,d)*vB;
            gl_FragColor = vec4(.82,.86,1.0, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* ---- Earth Surface Mesh ---- */
    const earthGeo = new THREE.SphereGeometry(Math.max(EPS, R), 128, 128); // 128 segments for perfect curvature
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1a4a7a,
      emissive: 0x001122,
      specular: 0x000000,
      shininess: 0
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globe.add(earthMesh);

    const texLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 2K Resolution Fallback Procedural Earth for extreme sharpness
    function buildProceduralEarth() {
      const c = document.createElement('canvas');
      c.width = 2048;
      c.height = 1024;
      const x = c.getContext('2d');
      if (!x) return;
      const g = x.createLinearGradient(0, 0, 0, 1024);
      g.addColorStop(0, '#0a2a4a');
      g.addColorStop(0.5, '#0d3d6b');
      g.addColorStop(1, '#0a2a4a');
      x.fillStyle = g;
      x.fillRect(0, 0, 2048, 1024);
      x.strokeStyle = 'rgba(0,170,255,0.18)';
      x.lineWidth = 2;
      for (let i = 0; i <= 12; i++) {
        x.beginPath();
        x.moveTo((i * 2048) / 12, 0);
        x.lineTo((i * 2048) / 12, 1024);
        x.stroke();
      }
      for (let i = 0; i <= 6; i++) {
        x.beginPath();
        x.moveTo(0, (i * 1024) / 6);
        x.lineTo(2048, (i * 1024) / 6);
        x.stroke();
      }
      x.fillStyle = 'rgba(0,80,40,0.5)';
      [
        [400, 300, 260, 180],
        [520, 620, 160, 260],
        [960, 280, 220, 170],
        [1020, 570, 160, 220],
        [1320, 350, 320, 220],
        [1520, 710, 170, 130]
      ].forEach(([cx, cy, w, h]) => {
        x.beginPath();
        for (let i = 0; i <= 18; i++) {
          const a = (i / 18) * Math.PI * 2;
          const rx = (w / 2) * (0.6 + Math.random() * 0.4);
          const ry = (h / 2) * (0.6 + Math.random() * 0.4);
          if (i === 0) x.moveTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
          else x.lineTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
        }
        x.closePath();
        x.fill();
      });
      earthMat.map = new THREE.CanvasTexture(c);
      earthMat.map.minFilter = THREE.LinearMipmapLinearFilter;
      earthMat.map.magFilter = THREE.LinearFilter;
      earthMat.map.anisotropy = maxAnisotropy;
      earthMat.color.set(0xffffff);
      earthMat.needsUpdate = true;
    }

    texLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      tex => {
        setIsLoading(false);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAnisotropy;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        earthMat.map = tex;
        earthMat.color.set(0xffffff);
        earthMat.needsUpdate = true;
        // Bump map
        texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-topology.png',
          bTex => {
            bTex.anisotropy = maxAnisotropy;
            bTex.minFilter = THREE.LinearMipmapLinearFilter;
            bTex.magFilter = THREE.LinearFilter;
            earthMat.bumpMap = bTex;
            earthMat.bumpScale = 0.07;
            earthMat.needsUpdate = true;
          },
          undefined,
          () => {
            console.warn('Bump map failed to load, falling back to basic Earth.');
          }
        );
      },
      undefined,
      () => {
        setIsLoading(false);
        buildProceduralEarth();
      }
    );

    /* ---- Grid Wireframe ---- */
    const wireGeo = new THREE.SphereGeometry(Math.max(EPS, R + 0.04), 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      wireframe: true,
      transparent: true,
      opacity: 0.055
    });
    globe.add(new THREE.Mesh(wireGeo, wireMat));

    /* ---- Atmosphere Glow ---- */
    const atmoGeo = new THREE.SphereGeometry(Math.max(EPS, R * 1.18), 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vWPos;
        varying vec3 vWNorm;
        void main(){
            vec4 wp = modelMatrix * vec4(position,1.0);
            vWPos  = wp.xyz;
            vWNorm = normalize(mat3(modelMatrix) * normalize(position));
            gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        varying vec3 vWPos;
        varying vec3 vWNorm;
        void main(){
            vec3 vd = normalize(cameraPosition - vWPos);
            float f = 1.0 - dot(vWNorm, vd);
            float i = pow(max(0.0, f), 3.5) * 1.1;
            vec3 c = mix(vec3(0.0,0.45,1.0), vec3(0.0,1.0,0.53), f*.35);
            gl_FragColor = vec4(c, i*.45);
        }`,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    globe.add(new THREE.Mesh(atmoGeo, atmoMat));

    /* ---- Inner Rim Glow ---- */
    const rimGeo = new THREE.SphereGeometry(Math.max(EPS, R * 1.005), 64, 64);
    const rimMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vVd; varying vec3 vN;
        void main(){
            vec4 mv = modelViewMatrix*vec4(position,1.0);
            vVd = normalize(-mv.xyz);
            vN  = normalize(normalMatrix * normalize(position));
            gl_Position = projectionMatrix*mv;
        }`,
      fragmentShader: `
        varying vec3 vVd; varying vec3 vN;
        void main(){
            float rim = 1.0 - max(0.0, dot(vVd, vN));
            float i = pow(rim, 4.5);
            gl_FragColor = vec4(0.0,0.65,1.0, i*.25);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide
    });
    globe.add(new THREE.Mesh(rimGeo, rimMat));

    /* ========== ESTABLISH LOCATIONS: DA NANG, HOANG SA, TRUONG SA ========== */
    const dnVec = ll2v(16.0544, 108.2022, R);

    // Light up Sun in Vietnam direction (slightly offset to produce beautiful bump map shadows)
    const sunDirection = dnVec.clone().normalize();
    sun.position.copy(sunDirection.multiplyScalar(20).add(new THREE.Vector3(2.5, 1.5, 1.0)));

    const hsCluster: [number, number][] = [
      [16.5, 112.0], [16.8, 112.3], [16.3, 111.9], [16.2, 111.6], [15.8, 112.5]
    ];
    const tsCluster: [number, number][] = [
      [10.0, 114.0], [11.5, 114.3], [10.7, 115.8], [9.6, 112.9], [8.6, 111.9], [8.8, 114.2], [10.4, 114.3]
    ];

    // -------- Territorial boundary polygons --------
    const hsBoundaryCoords: [number, number][] = [
      [17.3, 111.0], [17.6, 112.0], [17.2, 113.0], [16.4, 113.4],
      [15.5, 113.0], [15.1, 112.0], [15.4, 111.0], [16.2, 110.5]
    ];
    const tsBoundaryCoords: [number, number][] = [
      [12.2, 112.8], [12.8, 114.5], [12.2, 116.2], [10.5, 116.8],
      [8.8, 116.2], [7.6, 114.5], [7.6, 112.2], [8.5, 110.8], [10.2, 110.2], [11.8, 110.8]
    ];

    function createFill(latLons: [number, number][], color: number, opacity: number): THREE.Mesh {
      const pts = latLons.map(([lat, lon]) => ll2v(lat, lon, R * 1.002));
      const pos: number[] = []; const idx: number[] = [];
      for (let i = 1; i < pts.length - 1; i++) {
        pos.push(pts[0].x, pts[0].y, pts[0].z, pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
        idx.push((i - 1) * 3, (i - 1) * 3 + 1, (i - 1) * 3 + 2);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      const m = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending
      });
      return new THREE.Mesh(g, m);
    }

    const hsFill = createFill(hsBoundaryCoords, 0xffd700, 0.06);
    hsFill.name = 'hs-fill'; globe.add(hsFill);
    const tsFill = createFill(tsBoundaryCoords, 0xffa500, 0.06);
    tsFill.name = 'ts-fill'; globe.add(tsFill);

    function createBoundaryPoly(latLons: [number, number][], color: number): THREE.Line {
      const pts = latLons.map(([lat, lon]) => ll2v(lat, lon, R * 1.005));
      pts.push(pts[0].clone());
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineDashedMaterial({ color, dashSize: 0.035, gapSize: 0.035, transparent: true, opacity: 0.5 });
      const l = new THREE.Line(g, m);
      l.computeLineDistances();
      return l;
    }

    globe.add(createBoundaryPoly(hsBoundaryCoords, 0xffd700));
    globe.add(createBoundaryPoly(tsBoundaryCoords, 0xffa500));

    // -------- Island landmasses --------
    const ISLAND_ELEV = 0.04;

    function buildIsland(lat: number, lon: number, radius: number, color: number): THREE.Mesh {
      const segs = 10;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const ir = radius * (0.55 + Math.sin(i * 3.7) * 0.25 + Math.cos(i * 2.1) * 0.2);
        const dlat = (ir / R) * Math.cos(a) * (180 / Math.PI);
        const dlon = (ir / R) * Math.sin(a) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
        pts.push(ll2v(lat + dlat, lon + dlon, R + ISLAND_ELEV));
      }
      const ctr = ll2v(lat, lon, R + ISLAND_ELEV + 0.005);
      const pos: number[] = []; const idx: number[] = [];
      for (let i = 0; i < segs; i++) {
        const n = (i + 1) % segs;
        pos.push(ctr.x, ctr.y, ctr.z, pts[i].x, pts[i].y, pts[i].z, pts[n].x, pts[n].y, pts[n].z);
        idx.push(i * 3, i * 3 + 1, i * 3 + 2);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      const m = new THREE.MeshPhongMaterial({ color, flatShading: true, shininess: 2 });
      return new THREE.Mesh(g, m);
    }

    // Hoàng Sa — warm tropical greens
    const hsIslandData: [number, number, number, number][] = [
      [16.5, 112.0, 0.15, 0x4a9a4a],
      [16.8, 112.3, 0.10, 0x429442],
      [16.3, 111.9, 0.09, 0x4d9e4d],
      [16.2, 111.6, 0.07, 0x469646],
      [15.8, 112.5, 0.08, 0x509e50],
    ];
    hsIslandData.forEach(([lat, lon, r, c]) => globe.add(buildIsland(lat, lon, r, c)));

    // Trường Sa — cooler deep greens
    const tsIslandData: [number, number, number, number][] = [
      [10.0, 114.0, 0.13, 0x3a8a3a],
      [11.5, 114.3, 0.11, 0x358535],
      [10.7, 115.8, 0.09, 0x3d8f3d],
      [9.6, 112.9, 0.10, 0x388a38],
      [8.6, 111.9, 0.08, 0x3b8d3b],
      [8.8, 114.2, 0.07, 0x368836],
      [10.4, 114.3, 0.08, 0x3d8f3d],
    ];
    tsIslandData.forEach(([lat, lon, r, c]) => globe.add(buildIsland(lat, lon, r, c)));

    // -------- Đà Nẵng marker --------
    const dnMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.95 })
    );
    dnMarker.position.copy(dnVec);
    globe.add(dnMarker);

    // -------- Pulsing rings --------
    const pulsingRings: { mesh: THREE.Mesh; maxSize: number; speed: number }[] = [];
    function addPulsingRing(pos: THREE.Vector3, color: number, maxSize = 0.25) {
      const geo = new THREE.RingGeometry(0.01, maxSize, 32);
      const mat = new THREE.MeshBasicMaterial({
        color, side: THREE.DoubleSide, transparent: true, opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.copy(pos.clone().multiplyScalar(1.002));
      ring.lookAt(pos.clone().multiplyScalar(2));
      globe.add(ring);
      pulsingRings.push({ mesh: ring, maxSize, speed: 1.0 + Math.random() * 0.5 });
    }
    addPulsingRing(dnVec, 0x00ff88, 0.25);



    /* ========== ORBIT CONTROLS (Non-interactive Background mode) ========== */
    const ctrl = new OrbitControls(camera, renderer.domElement);
    ctrl.enableDamping = true;
    ctrl.dampingFactor = 0.05;
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.45;
    ctrl.enablePan = false;
    ctrl.enableZoom = false;   // Disable mouse wheel zoom (handled via scroll event manually)
    ctrl.enableRotate = false; // Disable mouse drag rotation to avoid scroll blocking
    ctrl.minDistance = 6.2;
    ctrl.maxDistance = 25;
    ctrl.minPolarAngle = Math.PI * 0.12;
    ctrl.maxPolarAngle = Math.PI * 0.88;

    /* ========== ANIMATION LOOP ========== */
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Twinkle stars
      starMat.uniforms.uTime.value = t;

      // Pulsing circles
      pulsingRings.forEach(r => {
        const scale = (t * r.speed) % 1.0;
        r.mesh.scale.set(scale, scale, 1);
        // @ts-ignore
        r.mesh.material.opacity = 0.75 * (1.0 - scale);
      });

      // SCROLL ZOOM
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const maxScroll = 1000;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      const targetDistance = 11.5 - scrollProgress * 4.7;

      // ORGANIC FLOATING/SWAYING EFFECT
      const swayLat = 16.0544 + Math.sin(t * 0.15) * 0.4;
      const swayLon = 108.2022 + Math.cos(t * 0.1) * 0.4;

      const vnVec = ll2v(swayLat, swayLon, 1);
      const targetDirection = vnVec.clone().normalize();
      const targetCamPos = targetDirection.clone().multiplyScalar(targetDistance);

      camera.position.lerp(targetCamPos, 0.05).normalize().multiplyScalar(targetDistance);

      ctrl.update();
      renderer.render(scene, camera);
    };

    animate();

    /* ========== RESIZE EVENT ========== */
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    /* ========== CLEANUP ========== */
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      // Clean up WebGL assets to avoid memory leak
      scene.clear();
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      dnMarker.geometry.dispose();
      (dnMarker.material as THREE.Material).dispose();

      pulsingRings.forEach(r => {
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
      });

      // Clear render container
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--dn-surface-base)] via-transparent to-[var(--dn-surface-base)] pointer-events-none z-10" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 25% 45%, color-mix(in oklch, var(--dn-border-strong) 12%, transparent) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 30%, color-mix(in oklch, var(--dn-border-strong) 6%, transparent) 0%, transparent 45%)
          `
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-3">
          <div className="w-10 h-10 border-4 border-[var(--dn-border-strong)]/20 border-t-[var(--dn-border-strong)] rounded-full animate-spin" />
          <span className="text-xs text-[var(--dn-text-secondary)] font-medium">Đang tải bản đồ 3D...</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
}
