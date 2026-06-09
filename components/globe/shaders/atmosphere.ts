/**
 * Atmosphere shader. Rendered on a slightly larger back-faced sphere with
 * additive blending to create a soft fresnel rim around the globe — a cool
 * halo warmed by ember at the very edge.
 */
export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  uniform vec3 uColor;
  uniform float uIntensity;

  void main() {
    vec3 viewDir = normalize(-vViewPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;
