"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Plane, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useMemo,
} from "react";
import * as THREE from "three";
import CustomCursor from "./CustomCursor";

// ─── Math Utils ───────────────────────────────────────────────────────────────
const expLerp = (
  current: number,
  target: number,
  speed: number,
  dt: number,
) => {
  if (dt <= 0) return current;
  return current + (target - current) * (1 - Math.exp(-speed * dt));
};

// ─── Cursor Spot Light ──────────────────────────────────────────────────────────
function CursorLight({
  hasEntered,
  cursorPosRef,
}: {
  hasEntered: boolean;
  cursorPosRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const lRef = useRef<THREE.SpotLight>(null);
  const targetObjRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const { viewport, scene } = useThree();

  const curPos = useRef(new THREE.Vector3(0, 0, 5));
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const intensityRef = useRef(0);

  useEffect(() => {
    const target = targetObjRef.current;
    scene.add(target);
    if (lRef.current) {
      lRef.current.target = target;
    }
    return () => {
      scene.remove(target);
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!lRef.current) return;

    if (hasEntered) {
      const nx = (cursorPosRef.current.x / window.innerWidth) * 2 - 1;
      const ny = -(cursorPosRef.current.y / window.innerHeight) * 2 + 1;

      const tx = (nx * viewport.width) / 2;
      const ty = (ny * viewport.height) / 2;

      // Position the spotlight slightly offset to create depth shadows
      targetPos.current.set(tx, ty, 0);
      curPos.current.set(tx - 1, ty + 1, 3);

      intensityRef.current = expLerp(intensityRef.current, 1.2, 4, delta);
    } else {
      intensityRef.current = expLerp(intensityRef.current, 0.4, 5, delta);
      // Default position
      targetPos.current.set(0, 0, 0);
      curPos.current.set(-1, 2, 4);
    }

    lRef.current.position.lerp(curPos.current, 0.1);
    targetObjRef.current.position.lerp(targetPos.current, 0.1);
    lRef.current.intensity = intensityRef.current;
  });

  return (
    <spotLight
      ref={lRef}
      color="#ffffff"
      angle={Math.PI / 6}
      penumbra={0.8}
      intensity={0}
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-bias={-0.0001}
    />
  );
}

// ─── Relief Model ─────────────────────────────────────────────────────────────
function ReliefModel({
  scrollY,
  material,
  hasEntered,
}: {
  scrollY: React.MutableRefObject<number>;
  material: THREE.Material;
  hasEntered: boolean;
}) {
  // Load the downloaded GLB properly now that the file isn't corrupted
  const { scene } = useGLTF("/bas-relief.glb");
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const modelWorldH = useRef(10);

  useLayoutEffect(() => {
    if (!scene || !groupRef.current || !innerGroupRef.current) return;

    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        (o as THREE.Mesh).material = material;
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.updateMatrixWorld(true);

    // Manual bounds calculation since Box3 can sometimes fail or return empty on initial mount in React Three Fiber
    // Known size of bas-relief.glb
    const szX = 0.467;
    const szY = 1.103;

    // Scale so the model is significantly taller than the screen to allow for parallax scrolling.
    // We base it on width so it occupies a nice chunk of the center.
    let s = (viewport.width / szX) * 0.5;

    // Ensure minimum height so it overflows screen
    if (s * szY < viewport.height * 1.5) {
      s = (viewport.height * 1.5) / szY;
    }

    scene.scale.setScalar(s);

    // We update matrix world here just in case
    scene.updateMatrixWorld(true);

    modelWorldH.current = szY * s;

    // Center the model horizontally, and position it so the top aligns with the top of the viewport when scroll is 0.
    scene.position.set(0, -(szY * s) / 2, 0);

    // Adjust background plane position
    const bgPlane = innerGroupRef.current.children.find(
      (c) => c.name === "bgPlane",
    ) as THREE.Mesh;
    if (bgPlane) {
      bgPlane.position.setScalar(0);
      // The model's min Z is approx -0.065 in local space.
      bgPlane.position.z = -0.064 * s;
    }
  }, [scene, viewport.width, viewport.height, material]);

  useFrame((state, delta) => {
    if (!groupRef.current || !innerGroupRef.current) return;

    // 1. Scroll Position Logic (Outer Group)
    const pageH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageH > 0 ? scrollY.current / pageH : 0;

    // Position so top of model is at top of screen at 0 progress and bottom at bottom of screen at 1 progress
    const h = modelWorldH.current;

    // The top of the model locally is at +h/2. The top of the screen is at +viewport.height/2.
    // So to align them: groupY = viewport.height/2 - h/2
    const startY = viewport.height / 2 - h / 2;

    // To align bottoms: The bottom of the model locally is -h/2. The bottom of the screen is -viewport.height/2.
    // So: groupY = -viewport.height/2 - (-h/2) = h/2 - viewport.height/2
    const endY = h / 2 - viewport.height / 2;

    // travel is from startY to endY
    const targetY = startY + progress * (endY - startY);

    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * 0.08;

    const targetZ = hasEntered ? 0.3 : 0;
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      delta * 3, // Slow rise makes it feel "heavy"
    );

    // 2. Cursor Parallax Logic (Inner Group)
    const { x, y } = state.pointer;

    // Extremely subtle tilt, matching the provided video reference
    const tiltX = y * 0.05;
    const tiltY = x * -0.05;

    innerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      innerGroupRef.current.rotation.x,
      tiltX,
      delta * 3,
    );
    innerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      innerGroupRef.current.rotation.y,
      tiltY,
      delta * 3,
    );
  });

  return (
    <group ref={groupRef}>
      <group ref={innerGroupRef}>
        <Plane args={[200, 200]} name="bgPlane" receiveShadow>
          <primitive object={material} attach="material" />
        </Plane>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default function BasReliefCanvas() {
  const scrollY = useRef(0);
  const [bgColor, setBgColor] = useState("#e5e5e5");
  const [hasEntered, setHasEntered] = useState(false);
  const cursorPosRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const bgVar = rootStyle.getPropertyValue("--bg").trim();
    if (bgVar) setBgColor(bgVar);

    const observer = new MutationObserver(() => {
      const newBg = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg")
        .trim();
      if (newBg && newBg !== bgColor) setBgColor(newBg);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [bgColor]);

  const onPointerEnter = () => setHasEntered(true);
  const onPointerLeave = () => setHasEntered(false);

  useEffect(() => {
    const onMove = () => setHasEntered(true);
    const onLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setHasEntered(false);
      }
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const baseMaterial = useMemo(() => {
    // ─── Generate Procedural Organic Plaster Texture ───
    const size = 1024; // Higher res for finer grain
    const data = new Uint8Array(size * size * 4);
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const idx = (i * size + j) * 4;
        
        // Base value: very bright warm grey
        // Layer 1: Micro-grain
        const grain = Math.random() * 15;
        // Layer 2: Subtle mottling (low freq)
        const mottle = (Math.sin(i * 0.02) * Math.cos(j * 0.02)) * 5;
        
        const val = Math.max(0, Math.min(255, 235 + grain + mottle));
        
        data[idx]     = val; 
        data[idx + 1] = val * 0.99; // Slightly warmer R>G
        data[idx + 2] = val * 0.98; // Slightly warmer
        data[idx + 3] = 255; 
      }
    }
    
    const plasterTex = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
    );
    plasterTex.wrapS = THREE.RepeatWrapping;
    plasterTex.wrapT = THREE.RepeatWrapping;
    plasterTex.repeat.set(2, 2); 
    plasterTex.needsUpdate = true;

    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e2e2e2"), 
      roughness: 0.9,
      metalness: 0.0,
      bumpMap: plasterTex,
      bumpScale: 0.003, 
      ior: 1.4,
      reflectivity: 0.1,
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 transition-colors duration-1000"
      style={{ background: "#dcdcdc" }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* 2. Custom Smooth Sub-Pixel Cursor */}
      <CustomCursor hasEntered={hasEntered} cursorPosRef={cursorPosRef} />

      {/* 3. ThreeJS Canvas */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 7], fov: 30 }}
          dpr={[1, 2]} // High res
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Subtle atmosphere */}
          <fog attach="fog" args={["#dcdcdc", 5, 20]} />

          {/* Cinematic Soft Lighting - Matching the reference bias */}
          <ambientLight intensity={1.4} color="#ffffff" />
          <pointLight position={[10, 10, 10]} intensity={0.5} />

          <directionalLight
            color="#ffffff"
            intensity={1.2}
            position={[-5, 5, 5]}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-bias={-0.0001}
          />
          
          <pointLight position={[5, -5, 5]} intensity={0.2} color="#ffffff" />

          <CursorLight hasEntered={hasEntered} cursorPosRef={cursorPosRef} />

          <Suspense fallback={null}>
            <ReliefModel
              scrollY={scrollY}
              material={baseMaterial}
              hasEntered={hasEntered}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
