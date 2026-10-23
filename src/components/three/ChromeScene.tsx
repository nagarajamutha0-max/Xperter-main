import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, PresentationControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type GlyphKind = "hero" | "rings" | "cross" | "knot" | "square" | "segments";

const BEVEL = { depth: 0.32, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.12, bevelSegments: 18, curveSegments: 96 };

function extrude(shape: THREE.Shape | THREE.Shape[], opts: Partial<typeof BEVEL> = {}) {
  const g = new THREE.ExtrudeGeometry(shape, { ...BEVEL, ...opts });
  g.center();
  g.computeVertexNormals();
  return g;
}

function rounded(pts: [number, number][], r = 0.08) {
  // polygon with softened corners so highlights roll smoothly over the edges
  const s = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = new THREE.Vector2(...pts[i]!);
    const prev = new THREE.Vector2(...pts[(i - 1 + n) % n]!);
    const next = new THREE.Vector2(...pts[(i + 1) % n]!);
    const a = p.clone().add(prev.clone().sub(p).setLength(r));
    const b = p.clone().add(next.clone().sub(p).setLength(r));
    if (i === 0) s.moveTo(a.x, a.y); else s.lineTo(a.x, a.y);
    s.quadraticCurveTo(p.x, p.y, b.x, b.y);
  }
  s.closePath();
  return s;
}

function crossShapes() {
  return [
    rounded([[-1.3, 1.3], [-0.15, 1.3], [-1.3, 0.15]]),
    rounded([[1.3, -1.3], [0.15, -1.3], [1.3, -0.15]]),
    rounded([[-0.9, -1.3], [-1.3, -0.9], [0.9, 1.3], [1.3, 0.9]]),
  ];
}

function roundedSquareWithHole() {
  const s = new THREE.Shape();
  const r = 0.55, w = 1.3;
  s.moveTo(-w + r, -w);
  s.lineTo(w - r, -w); s.quadraticCurveTo(w, -w, w, -w + r);
  s.lineTo(w, w - r); s.quadraticCurveTo(w, w, w - r, w);
  s.lineTo(-w + r, w); s.quadraticCurveTo(-w, w, -w, w - r);
  s.lineTo(-w, -w + r); s.quadraticCurveTo(-w, -w, -w + r, -w);
  const h = new THREE.Path();
  h.absarc(0, 0, 0.55, 0, Math.PI * 2, true);
  s.holes.push(h);
  return s;
}

function asteriskShapes() {
  // four rounded bars crossing at the centre — the asterisk glyph from the reference sheet
  return [0, 1, 2, 3].map((i) => {
    const s = new THREE.Shape();
    const L = 1.35, W = 0.16;
    s.moveTo(-L + W, -W);
    s.lineTo(L - W, -W); s.absarc(L - W, 0, W, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(-L + W, W); s.absarc(-L + W, 0, W, Math.PI / 2, (3 * Math.PI) / 2, false);
    const m = new THREE.Matrix3().rotate((i * Math.PI) / 4);
    const pts = s.getPoints(64).map((p) => p.applyMatrix3(m));
    return new THREE.Shape(pts);
  });
}

function Chrome() {
  return (
    <meshPhysicalMaterial
      color="#f3f4f6"
      metalness={1}
      roughness={0.035}
      clearcoat={1}
      clearcoatRoughness={0.02}
      envMapIntensity={1.7}
      reflectivity={1}
    />
  );
}

function GlyphMesh({ kind }: { kind: GlyphKind }) {
  const geos = useMemo(() => {
    switch (kind) {
      case "cross": return crossShapes().map((sh) => extrude(sh));
      case "square": return [extrude(roundedSquareWithHole())];
      case "hero": return asteriskShapes().map((sh) => extrude(sh, { bevelSize: 0.07, bevelThickness: 0.1, depth: 0.22 }));
      default: return [];
    }
  }, [kind]);

  if (kind === "rings")
    return (
      <group>
        <mesh position={[-0.48, 0, 0]}><torusGeometry args={[0.95, 0.24, 96, 256]} /><Chrome /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.48, 0, 0]}><torusGeometry args={[0.95, 0.24, 96, 256]} /><Chrome /></mesh>
      </group>
    );
  if (kind === "segments") {
    const arc = Math.PI / 2 - 0.42;
    return (
      <group>
        {[0, 1, 2, 3].map((i) => {
          const a = (i * Math.PI) / 2 + 0.21 + Math.PI / 4;
          return (
            <group key={i} rotation={[0, 0, a]}>
              <mesh><torusGeometry args={[1.1, 0.24, 96, 160, arc]} /><Chrome /></mesh>
              <mesh position={[1.1, 0, 0]}><sphereGeometry args={[0.24, 64, 64]} /><Chrome /></mesh>
              <mesh position={[Math.cos(arc) * 1.1, Math.sin(arc) * 1.1, 0]}><sphereGeometry args={[0.24, 64, 64]} /><Chrome /></mesh>
            </group>
          );
        })}
        <mesh><sphereGeometry args={[0.38, 96, 96]} /><Chrome /></mesh>
      </group>
    );
  }
  if (kind === "knot")
    return <mesh><torusKnotGeometry args={[0.9, 0.27, 512, 96, 2, 3]} /><Chrome /></mesh>;
  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} position={kind === "hero" ? [0, 0, (i - 1.5) * 0.004] : [0, 0, 0]}><Chrome /></mesh>
      ))}
      {kind === "hero" && (
        <>
          <mesh><sphereGeometry args={[0.3, 96, 96]} /><Chrome /></mesh>
          <mesh rotation={[Math.PI / 2.3, 0, 0]}><torusGeometry args={[1.95, 0.05, 48, 320]} /><Chrome /></mesh>
        </>
      )}
    </group>
  );
}

function Rig({ kind, interactive }: { kind: GlyphKind; interactive: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const spin = useRef(0);
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const g = ref.current;
    if (!g) return;
    spin.current += dt * 0.3;
    const k = 1 - Math.exp(-2.5 * dt);
    const tx = interactive ? -state.pointer.y * 0.35 : 0;
    const ty = interactive ? state.pointer.x * 0.5 : 0;
    g.rotation.x += (tx + Math.sin(spin.current * 0.7) * 0.12 - g.rotation.x) * k;
    g.rotation.y += (ty + Math.sin(spin.current) * 0.6 - g.rotation.y) * k;
    g.position.y += (Math.sin(spin.current * 1.6) * 0.08 - g.position.y) * k;
  });
  return (
    <group ref={ref}>
      <GlyphMesh kind={kind} />
    </group>
  );
}

export default function ChromeScene({ kind, interactive = true }: { kind: GlyphKind; interactive?: boolean | undefined }) {
  return (
    <Canvas
      dpr={interactive ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <ambientLight intensity={0.25} />
      <PresentationControls
        enabled={interactive}
        global={false}
        cursor={interactive}
        snap
        speed={1.2}
        rotation={[0, 0, 0]}
        polar={[-0.6, 0.6]}
        azimuth={[-1.2, 1.2]}
      >
        <Rig kind={kind} interactive={interactive} />
      </PresentationControls>
      <ContactShadows position={[0, -2.1, 0]} opacity={0.35} scale={8} blur={2.8} far={3} color="#3b4350" />
      {/* Studio environment: bright strips + dark panels give chrome its contrast */}
      <Environment resolution={512}>
        <color attach="background" args={["#b9bfc6"]} />
        <Lightformer intensity={4} position={[0, 6, -1]} rotation-x={Math.PI / 2} scale={[14, 2.5, 1]} />
        {[-6, -2, 2, 6].map((x) => (
          <Lightformer key={x} intensity={2.4} position={[x, 0, -6]} scale={[0.9, 12, 1]} />
        ))}
        <Lightformer intensity={2.2} color="#f5e7d6" position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} />
        <Lightformer intensity={2.2} color="#dde6f0" position={[6, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[12, 2, 1]} />
        <Lightformer intensity={1.8} form="ring" position={[2, 2, 7]} scale={2.5} />
        <Lightformer intensity={1} color="#1d2126" position={[0, -1.4, 5]} scale={[16, 1.4, 1]} />
        <Lightformer intensity={1} color="#14171b" position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[30, 30, 1]} />
      </Environment>
    </Canvas>
  );
}
