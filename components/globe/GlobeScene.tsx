import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, type Group, Quaternion, Vector3 } from 'three';

import { latLngToVector3 } from './geo';
import { MemoryPoints, type GlobePoint } from './MemoryPoints';
import { atmosphereFragmentShader, atmosphereVertexShader } from './shaders/atmosphere';
import { earthFragmentShader, earthVertexShader } from './shaders/earth';

const RADIUS = 1;
const PHASE_TWO_START = 1.4; // seconds of free rotation before zooming in
const PHASE_TWO_DURATION = 1.6;
const Z_START = 3.4;
const Z_END = 1.7;
const FRONT = new Vector3(0, 0, 1);

interface GlobeSceneProps {
  echoes: GlobePoint[];
  focusLat: number;
  focusLng: number;
  reducedMotion: boolean;
  landColor: string;
  rimColor: string;
  emberColor: string;
  onZoomComplete: () => void;
}

function easeInOut(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

/**
 * The 3D content and its opening choreography: slow free rotation while the
 * memory points pulse, then a slerp that brings the focus coordinate to the
 * front as the camera dollies in, ending with `onZoomComplete` for the handoff
 * to the map.
 */
export function GlobeScene({
  echoes,
  focusLat,
  focusLng,
  reducedMotion,
  landColor,
  rimColor,
  emberColor,
  onZoomComplete,
}: GlobeSceneProps) {
  const groupRef = useRef<Group>(null);
  const startQuat = useRef(new Quaternion());
  const completed = useRef(false);
  const camera = useThree((s) => s.camera);

  const earthUniforms = useMemo(
    () => ({
      uLandColor: { value: new Color(landColor) },
      uRimColor: { value: new Color(rimColor) },
    }),
    [landColor, rimColor],
  );
  const atmosphereUniforms = useMemo(
    () => ({ uColor: { value: new Color(rimColor) }, uIntensity: { value: 1.1 } }),
    [rimColor],
  );

  // Quaternion that rotates the focus coordinate to face the camera (+Z).
  const targetQuat = useMemo(() => {
    const dir = latLngToVector3(focusLat, focusLng, 1).normalize();
    return new Quaternion().setFromUnitVectors(dir, FRONT);
  }, [focusLat, focusLng]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (reducedMotion) {
      group.quaternion.copy(targetQuat);
      camera.position.setZ(Z_END);
      if (!completed.current) {
        completed.current = true;
        onZoomComplete();
      }
      return;
    }

    const elapsed = clock.elapsedTime;
    if (elapsed < PHASE_TWO_START) {
      group.rotateY(delta * 0.12);
      startQuat.current.copy(group.quaternion);
    } else {
      const progress = Math.min(1, (elapsed - PHASE_TWO_START) / PHASE_TWO_DURATION);
      const eased = easeInOut(progress);
      group.quaternion.slerpQuaternions(startQuat.current, targetQuat, eased);
      camera.position.setZ(Z_START + (Z_END - Z_START) * eased);
      if (progress >= 1 && !completed.current) {
        completed.current = true;
        onZoomComplete();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <shaderMaterial
            vertexShader={earthVertexShader}
            fragmentShader={earthFragmentShader}
            uniforms={earthUniforms}
          />
        </mesh>

        {/* Faint graticule to read as a globe without a photographic texture. */}
        <mesh>
          <sphereGeometry args={[RADIUS * 1.004, 24, 16]} />
          <meshBasicMaterial color={rimColor} wireframe transparent opacity={0.06} />
        </mesh>

        <mesh scale={1.18}>
          <sphereGeometry args={[RADIUS, 48, 48]} />
          <shaderMaterial
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
            uniforms={atmosphereUniforms}
            transparent
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <MemoryPoints
          points={echoes}
          radius={RADIUS}
          color={emberColor}
          reducedMotion={reducedMotion}
        />
      </group>
    </>
  );
}
