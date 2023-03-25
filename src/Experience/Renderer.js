import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import { EffectComposer } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/SMAAPass.js';
import { OutlinePass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/OutlinePass.js';
import Experience from "./Experience";

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
        this.setPostProcessing()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        }
        )

        this.night = new THREE.Color('#140117');
        this.reset()
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.antialias = true
    }

    reset() {
        this.scene.background = new THREE.Color()
    }
    setPostProcessing() {
        const renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: this.instance.getPixelRatio() === 1 ? 2 : 0
            }
        )
        this.effectComposer = new EffectComposer(this.instance, renderTarget)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        const renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(renderPass)

        this.setOutlinePass()

        if (this.instance.getPixelRatio() === 1 && !this.instance.capabilities.isWebGL2) {
            this.setAntialias()
        }
    }

    setOutlinePass() {
        this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera.instance);
        this.outlinePass.edgeStrength = 5.0
        this.outlinePass.edgeGlow = 0.2
        this.outlinePass.edgeThickness = 3
        this.outlinePass.visibleEdgeColor.set('red')
        this.outlinePass.hiddenEdgeColor.set('red');
        this.effectComposer.addPass(this.outlinePass);
    }


    setAntialiasSMAA() {
        const smaaPass = new SMAAPass()
        this.effectComposer.addPass(smaaPass)
        console.log('Using SMAA')
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        if (this.effectComposer) {
            this.effectComposer.setSize(this.sizes.width, this.sizes.height)
            this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        }
    }

    update() {
        if (this.effectComposer) {
            this.effectComposer.render()
        } else
            this.instance.render(this.scene, this.camera.instance)

        if (this.experience.timerOn === false) return;
        this.scene.background.lerp(this.night, this.experience.colorSpeed);
    }
}
