import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from "../../Experience";
import visibleHeightAtZDepth from '../../Utils/visibleHeightAtZDepth.js'
import visibleWidthAtZDepth from '../../Utils/visibleWidthAtZDepth.js'
import fullScreenGroup from '../../Utils/fullScreenGroup';

export default class Start {
    constructor(startingColor) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.camera = this.experience.camera

        //setup
        this.resource = this.resources.items.origamiBoat
        this.startingColor = startingColor
        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)

        this.origamiBoat = this.model.children.find((child) => child.name === 'origamiBoat')
        this.origamiBoat.material.metalness = 0
        this.origamiBoat.material.side = THREE.DoubleSide
        this.origamiBoat.material.color = this.startingColor

        this.resize()

        this.fullscreen = fullScreenGroup(
            [{ object: this.model, X: 0, Y: 0, Z: 0 }],
            this.camera.instance,
            this.camera.instance.position.length() * 0.2,
            this.scene,
            false)
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.resource.scene)
        this.action = this.animation.mixer.clipAction(this.resource.animations[0])
        this.action.setLoop(THREE.LoopOnce)

        this.action2 = this.animation.mixer.clipAction(this.resource.animations[1])
        this.action2.setLoop(THREE.LoopOnce)
    }

    playAnimations() {
        this.action.reset()
        this.action2.reset()
        this.action.play()
        this.action2.play()
    }

    resize() {
        if (this.sizes.width > this.sizes.height) {
            const scale = 4 * visibleHeightAtZDepth(this.camera.instance.position.length() * 0.2, this.camera.instance)
            this.model.scale.set(scale, scale, scale)
        }
        if (this.sizes.width <= this.sizes.height) {
            const scale = 4 * visibleWidthAtZDepth(this.camera.instance.position.length() * 0.2, this.camera.instance)
            this.model.scale.set(scale, scale, scale)
        }
    }

    update() {
        this.animation.mixer.update(this.time.deltaTime * 1.0)
    }
}