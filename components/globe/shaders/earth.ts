/**
 * Earth shader. Deliberately stylized rather than photographic: a cool slate
 * sphere with depth shading and a faint warm rim — the "cool world" of the
 * design thesis. A land-mask texture can be sampled here later to define
 * continents without changing the surrounding scene.
 */
export const earthVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const earthFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  uniform vec3 uLandColor;
  uniform vec3 uRimColor;

  void main() {
    vec3 viewDir = normalize(-vViewPosition);
    float facing = max(dot(viewDir, vNormal), 0.0);
    // Darken toward the limb for volume; add a faint warm rim at the edge.
    float rim = pow(1.0 - facing, 4.0);
    vec3 color = mix(uLandColor * 0.82, uLandColor, facing);
    color += uRimColor * rim * 0.35;
    gl_FragColor = vec4(color, 1.0);
  }
`;
