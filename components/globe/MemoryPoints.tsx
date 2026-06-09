import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Mesh, type MeshBasicMaterial, Quaternion, Vector3 } from 'three';

import { latLngToVector3 } from './geo';

export interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
}

interface MemoryPointsProps {
  points: GlobePoint[];
  radius: number;
  color: string;
  reducedMotion: boolean;
}

// Ring geometry lies in the XY plane (normal +Z); rotate that to the point's
// outward radial so each ring sits flat on the sphere surface.
const RING_NORMAL = new Vector3(0, 0, 1);
const RIPPLE_SECONDS = 2.4;

/** Ember memory points that pulse with the signature sound-ring language. */
export function MemoryPoints({ points, radius, color, reducedMotion }: MemoryPointsProps) {
  return (
    <group>
      {points.map((point, i) => (
        <MemoryPoint
          key={point.id}
          point={point}
          radius={radius}
          color={color}
          // Stagger ripples so they don't pulse in unison.
          phase={(i * 0.7) % RIPPLE_SECONDS}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

interface MemoryPointProps {
  point: GlobePoint;
  radius: number;
  color: string;
  phase: number;
  reducedMotion: boolean;
}

function MemoryPoint({ point, radius, color, phase, reducedMotion }: MemoryPointProps) {
  const ringRef = useRef<Mesh>(null);

  const position = useMemo(
    () => latLngToVector3(point.lat, point.lng, radius * 1.002),
    [point.lat, point.lng, radius],
  );
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(RING_NORMAL, position.clone().normalize()),
    [position],
  );

  useFrame(({ clock }) => {
    const ring = ringRef.current;
    if (!ring || reducedMotion) return;
    const t = (clock.elapsedTime + phase) % RIPPLE_SECONDS;
    const progress = t / RIPPLE_SECONDS;
    const scale = 0.4 + progress * 1.4;
    ring.scale.set(scale, scale, scale);
    (ring.material as MeshBasicMaterial).opacity = (1 - progress) * 0.55;
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[radius * 0.012, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[radius * 0.02, radius * 0.027, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
