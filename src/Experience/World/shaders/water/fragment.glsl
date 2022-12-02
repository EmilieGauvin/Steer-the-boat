uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec2 vUv;

void main()
{

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = clamp(mixStrength, -0.5, 1.5);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    float alpha = ((1.0-vUv.y)+0.5) * (1.0-vUv.y) * vUv.x * (1.0-vUv.x) * 5.0;

    gl_FragColor = vec4(color, alpha);
}
