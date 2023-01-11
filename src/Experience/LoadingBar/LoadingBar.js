import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience.js'

export default class LoadingBar {

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.setOverlay()
        this.loaded = false

        // Event fires when all resources are loaded
        this.resources.on('ready', () => {
            this.loaded = true
        })
    }

    setOverlay() {
        // Set Geometry according to window sizes
        const baseDim = 2
        if (this.sizes.width < this.sizes.height) {
            this.scale = this.sizes.width / this.sizes.height
            this.overlayGeometry = new THREE.PlaneGeometry(baseDim, baseDim * this.scale, 1, 1)
        }
        if (this.sizes.width >= this.sizes.height) {
            this.scale = this.sizes.height / this.sizes.width
            this.overlayGeometry = new THREE.PlaneGeometry(baseDim * this.scale, baseDim, 1, 1)
        }

        // Material
        this.overlayMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
                uniform vec3 uColor;
                uniform float uTime;
                varying vec2 vUv;
                void main()
                {
                    float frame = 1.0 - step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

                    float waves = + sin(vUv.x*25.0  - uTime * 3.0) * 0.3;

                    float modY = mod(vUv.y * 10.0, 1.0);
                    float strength = step(0.5, modY + waves);
                    float strength1 = step(0.5, 0.97-modY - waves);
                    float line = (strength + strength1);
                    gl_FragColor = vec4((uColor/ line) , uAlpha* frame);
                }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 },
                uColor: { value: new THREE.Vector3(0.48235294, 0.40784314, 0.93333333) },
                uTime: { value: 0 }
            }
        })

        // Mesh
        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlay.name = 'overlay'
        this.scene.add(this.overlay)
    }

    update() {
        // if overlay in scene and resources loaded, overlay disappears and is disposed
        if (this.scene.getObjectByName('overlay')) {
            this.overlayMaterial.uniforms.uTime.value = this.time.elapsedTime
            if (this.loaded === true) {
                if (this.overlayMaterial.uniforms.uAlpha.value > 0) this.overlayMaterial.uniforms.uAlpha.value -= 1.5 * this.time.deltaTime
                else {
                    this.scene.remove(this.overlay)
                    this.overlayGeometry.dispose()
                    this.overlayMaterial.dispose()
                }
            }
        }
    }
}

